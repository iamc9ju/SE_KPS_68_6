"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
    userLocation: { lat: number; lng: number };
    restaurantLocation: { lat: number; lng: number };
    driverLocation: { lat: number; lng: number } | null;
    progress: number;
}

// Custom icon creators
const createIcon = (color: string, emoji: string, size: number = 36) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: ${size}px; height: ${size}px;
                background: ${color};
                border-radius: 14px;
                display: flex; align-items: center; justify-content: center;
                font-size: ${size * 0.45}px;
                box-shadow: 0 4px 20px ${color}66, 0 0 0 4px rgba(255,255,255,0.15);
                border: 2px solid rgba(255,255,255,0.25);
                transition: all 0.3s ease;
            ">${emoji}</div>
            <div style="
                position: absolute;
                bottom: -6px; left: 50%; transform: translateX(-50%);
                width: 10px; height: 10px;
                background: ${color};
                border-radius: 50%;
                box-shadow: 0 0 15px ${color}88;
                animation: pulse-dot 2s ease-in-out infinite;
            "></div>
        `,
        iconSize: [size, size + 10],
        iconAnchor: [size / 2, size + 6],
    });
};

const userIcon = createIcon('#a3d133', '📍', 40);
const restaurantIcon = createIcon('#f97316', '🍳', 38);
const driverIcon = createIcon('#3b82f6', '🛵', 42);

// Auto-fit map bounds
function FitBounds({ points }: { points: [number, number][] }) {
    const map = useMap();

    useEffect(() => {
        if (points.length >= 2) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
        }
    }, [map, points]);

    return null;
}

// Fetch real road route from OSRM (free, no API key)
async function fetchRoute(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
): Promise<[number, number][]> {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates;
            // GeoJSON → Leaflet: [lng, lat] → [lat, lng]
            const fullRoute: [number, number][] = coordinates.map(
                (c: [number, number]) => [c[1], c[0]] as [number, number]
            );

            // Simplify route: keep max ~80 points for smooth but visible animation
            if (fullRoute.length > 80) {
                const step = Math.floor(fullRoute.length / 80);
                const simplified: [number, number][] = [];
                for (let i = 0; i < fullRoute.length; i += step) {
                    simplified.push(fullRoute[i]);
                }
                // Always include the last point
                simplified.push(fullRoute[fullRoute.length - 1]);
                return simplified;
            }
            return fullRoute;
        }
    } catch (error) {
        console.warn('OSRM routing failed, using straight line:', error);
    }
    // Fallback: generate intermediate points along a straight line
    const steps = 20;
    const points: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        points.push([
            from.lat + (to.lat - from.lat) * t,
            from.lng + (to.lng - from.lng) * t,
        ]);
    }
    return points;
}

export default function MapView({ userLocation, restaurantLocation, driverLocation, progress }: MapViewProps) {
    const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
    const [driverIndex, setDriverIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const center: [number, number] = [
        (userLocation.lat + restaurantLocation.lat) / 2,
        (userLocation.lng + restaurantLocation.lng) / 2,
    ];

    // Fetch real road route on mount
    useEffect(() => {
        fetchRoute(restaurantLocation, userLocation).then((points) => {
            console.log(`📍 Route loaded: ${points.length} points`);
            setRoutePoints(points);
        });
    }, [restaurantLocation.lat, restaurantLocation.lng, userLocation.lat, userLocation.lng]);

    // Animate driver along route when progress >= 3
    useEffect(() => {
        // Clear any existing animation
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (progress < 3 || routePoints.length === 0) {
            setDriverIndex(0);
            setIsAnimating(false);
            return;
        }

        if (progress === 4) {
            // Snap to end
            setDriverIndex(routePoints.length - 1);
            setIsAnimating(false);
            return;
        }

        // Start animation
        setIsAnimating(true);
        setDriverIndex(0);

        // Target: complete in ~22 seconds (between step 3 at 20s and step 4 at 45s)
        const totalDuration = 22000; // ms
        const msPerPoint = Math.max(100, Math.floor(totalDuration / routePoints.length));

        console.log(`🛵 Starting driver animation: ${routePoints.length} points, ${msPerPoint}ms per point`);

        let currentIdx = 0;
        intervalRef.current = setInterval(() => {
            currentIdx += 1;
            if (currentIdx >= routePoints.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsAnimating(false);
                return;
            }
            setDriverIndex(currentIdx);
        }, msPerPoint);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [progress, routePoints]);

    // Current driver position on the route
    const currentDriverPos: [number, number] | null =
        progress >= 3 && routePoints.length > 0
            ? routePoints[Math.min(driverIndex, routePoints.length - 1)]
            : null;

    // Split route into traveled and remaining
    const traveledPoints = routePoints.slice(0, driverIndex + 1);
    const remainingPoints = routePoints.slice(driverIndex);

    // Map bounds points
    const boundsPoints: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [restaurantLocation.lat, restaurantLocation.lng],
    ];
    if (currentDriverPos) boundsPoints.push(currentDriverPos);

    return (
        <>
            <style jsx global>{`
                .leaflet-container {
                    background: #0f1a0a !important;
                    font-family: inherit;
                    z-index: 0 !important;
                    isolation: isolate;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                }
                .leaflet-control-zoom a {
                    background: rgba(15, 26, 10, 0.9) !important;
                    color: #a3d133 !important;
                    border: 1px solid rgba(163, 209, 51, 0.2) !important;
                    backdrop-filter: blur(10px);
                }
                .leaflet-control-zoom a:hover {
                    background: rgba(163, 209, 51, 0.2) !important;
                }
                .leaflet-popup-content-wrapper {
                    background: rgba(15, 26, 10, 0.95) !important;
                    color: white !important;
                    border-radius: 16px !important;
                    border: 1px solid rgba(163, 209, 51, 0.2) !important;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
                    backdrop-filter: blur(10px);
                }
                .leaflet-popup-tip {
                    background: rgba(15, 26, 10, 0.95) !important;
                }
                .leaflet-popup-close-button {
                    color: rgba(255,255,255,0.5) !important;
                }
                .custom-marker {
                    background: none !important;
                    border: none !important;
                }
                @keyframes pulse-dot {
                    0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
                    50% { transform: translateX(-50%) scale(1.8); opacity: 0.3; }
                }
                .leaflet-control-attribution {
                    background: rgba(15, 26, 10, 0.7) !important;
                    color: rgba(255,255,255,0.3) !important;
                    font-size: 9px !important;
                    border-radius: 8px 0 0 0 !important;
                }
                .leaflet-control-attribution a {
                    color: rgba(163, 209, 51, 0.5) !important;
                }
            `}</style>
            <MapContainer
                center={center}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <FitBounds points={boundsPoints} />

                {/* Remaining route (dashed) */}
                {routePoints.length > 1 && (
                    <Polyline
                        positions={progress >= 3 ? remainingPoints : routePoints}
                        pathOptions={{
                            color: '#a3d133',
                            weight: 4,
                            opacity: 0.2,
                            dashArray: '8, 12',
                            lineCap: 'round',
                        }}
                    />
                )}

                {/* Traveled route (solid bright green) */}
                {progress >= 3 && traveledPoints.length > 1 && (
                    <Polyline
                        positions={traveledPoints}
                        pathOptions={{
                            color: '#a3d133',
                            weight: 5,
                            opacity: 0.9,
                            lineCap: 'round',
                        }}
                    />
                )}

                {/* Restaurant Marker */}
                <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{ fontSize: '13px' }}>🍳 Wellmate Kitchen</strong>
                            <br />
                            <span style={{ fontSize: '11px', opacity: 0.6 }}>Sukhumvit Branch</span>
                        </div>
                    </Popup>
                </Marker>

                {/* User Marker */}
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{ fontSize: '13px' }}>📍 Your Location</strong>
                            <br />
                            <span style={{ fontSize: '11px', opacity: 0.6 }}>Delivery destination</span>
                        </div>
                    </Popup>
                </Marker>

                {/* Driver Marker - animates along real roads */}
                {currentDriverPos && (
                    <Marker position={currentDriverPos} icon={driverIcon}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong style={{ fontSize: '13px' }}>🛵 Somchai Delivery</strong>
                                <br />
                                <span style={{ fontSize: '11px', opacity: 0.6 }}>On the way to you</span>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </>
    );
}
