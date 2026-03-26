"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, MapPin, Navigation, Clock, Phone, Car, ChefHat, CheckCircle2, Package } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('./MapView'), { ssr: false });

interface DriverLocation {
    lat: number;
    lng: number;
}

export default function OrderTrackingPage() {
    const [progress, setProgress] = useState(1); // 1: Accepted, 2: Preparing, 3: On The Way, 4: Delivered
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);

    const MOCK_RESTAURANTS = [
        { lat: 13.7563, lng: 100.5018 }, // Phra Nakhon
        { lat: 13.7367, lng: 100.5231 }, // Silom
        { lat: 13.7225, lng: 100.5815 }, // Ekkamai
        { lat: 13.8055, lng: 100.5401 }  // Chatuchak
    ];

    const MOCK_DESTINATIONS = [
        { lat: 13.7450, lng: 100.5340 }, // Siam
        { lat: 13.7150, lng: 100.5520 }, // Sathorn
        { lat: 13.7650, lng: 100.5100 }, // Dusit
        { lat: 13.7900, lng: 100.5600 }  // Ratchada
    ];

    // Restaurant location (mock — could come from API)
    const [restaurantLocation, setRestaurantLocation] = useState(MOCK_RESTAURANTS[0]);

    // Get user's real GPS location
    useEffect(() => {
        // Randomize the restaurant on mount
        setRestaurantLocation(MOCK_RESTAURANTS[Math.floor(Math.random() * MOCK_RESTAURANTS.length)]);

        // Randomize the fallback destination on mount
        const randomDest = MOCK_DESTINATIONS[Math.floor(Math.random() * MOCK_DESTINATIONS.length)];

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error.message);
                    // Fallback random location
                    setUserLocation(randomDest);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setUserLocation(randomDest);
        }
    }, []);

    // Simulate order progress & driver movement with realistic timing
    useEffect(() => {
        // Step 1 → 2: Kitchen starts preparing (8 seconds)
        const timer1 = setTimeout(() => {
            setProgress(2);
        }, 8000);

        // Step 2 → 3: Driver picks up and starts delivering (20 seconds)
        const timer2 = setTimeout(() => {
            setProgress(3);
            setDriverLocation({ ...restaurantLocation });
        }, 20000);

        // Driver moves to midpoint (30 seconds)
        const timer3 = setTimeout(() => {
            if (userLocation) {
                setDriverLocation({
                    lat: (restaurantLocation.lat + (userLocation?.lat || 13.7450)) / 2,
                    lng: (restaurantLocation.lng + (userLocation?.lng || 100.5340)) / 2,
                });
            }
        }, 30000);

        // Step 3 → 4: Delivered (45 seconds)
        const timer4 = setTimeout(() => {
            setProgress(4);
            if (userLocation) {
                setDriverLocation({ ...userLocation });
            }
        }, 45000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [userLocation, restaurantLocation]);

    const STEPS = [
        { key: 1, title: "Order Accepted", icon: <CheckCircle2 size={18} />, shortTitle: "Accepted" },
        { key: 2, title: "Preparing Food", icon: <ChefHat size={18} />, shortTitle: "Preparing" },
        { key: 3, title: "On The Way", icon: <Car size={18} />, shortTitle: "On The Way" },
        { key: 4, title: "Delivered", icon: <Package size={18} />, shortTitle: "Delivered" },
    ];

    const STATUSES: Record<number, { title: string; desc: string }> = {
        1: { title: "Order Accepted", desc: "The kitchen has verified your order" },
        2: { title: "Preparing Food", desc: "Your healthy meal is being cooked" },
        3: { title: "On The Way", desc: "Driver is heading to your location" },
        4: { title: "Delivered!", desc: "Enjoy your healthy meal! 🎉" },
    };

    const currentStatus = STATUSES[progress];

    return (
        <div className="min-h-screen bg-[#0f1a0a] font-sans text-white relative overflow-hidden isolate">
            {/* Top Header - outside map to avoid overflow-hidden clipping */}
            <header className="absolute top-0 left-0 w-full z-[1002] px-5 pt-4 flex items-center justify-between">
                <Link href="/" className="bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10 transition-all hover:bg-black/60 active:scale-95">
                    <ArrowLeft size={20} className="text-white" />
                </Link>
                <div className="bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-2xl font-bold text-sm text-white border border-white/10">
                    Order #WM-8492
                </div>
                <div className="w-11"></div>
            </header>

            {/* === MAP SECTION === */}
            <div className="relative w-full h-[55vh] z-0 overflow-hidden" style={{ isolation: 'isolate' }}>
                {userLocation && (
                    <MapView
                        userLocation={userLocation}
                        restaurantLocation={restaurantLocation}
                        driverLocation={driverLocation}
                        progress={progress}
                    />
                )}
                {!userLocation && (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-[#a3d133] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 text-sm font-medium">Getting your location...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* === BOTTOM SHEET === */}
            <div className="relative z-[1001] -mt-8">
                <div className="max-w-xl mx-auto px-4 space-y-4 pb-10">

                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-[#1a2912] to-[#111f0b] rounded-[28px] p-6 border border-[#2a4018]/60 shadow-[0_-8px_40px_-10px_rgba(163,209,51,0.15)]">
                        {/* Drag Handle */}
                        <div className="flex justify-center mb-5">
                            <div className="w-10 h-1 bg-white/15 rounded-full"></div>
                        </div>

                        {/* ETA */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-baseline gap-1.5">
                                <span className="text-5xl font-black tracking-tight text-[#a3d133] drop-shadow-[0_0_20px_rgba(163,209,51,0.3)]">
                                    {progress === 4 ? "0:00" : "15-20"}
                                </span>
                                {progress !== 4 && <span className="text-lg font-bold text-[#a3d133]/60">min</span>}
                            </div>
                            <p className="text-sm font-semibold text-white/50 mt-1">Estimated Delivery Time</p>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex items-center justify-between mb-6 px-1">
                            {STEPS.map((step, i) => (
                                <React.Fragment key={step.key}>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`
                                            w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-700
                                            ${progress >= step.key
                                                ? 'bg-[#a3d133] text-[#0f1a0a] shadow-[0_0_20px_rgba(163,209,51,0.4)]'
                                                : 'bg-white/5 text-white/25 border border-white/10'
                                            }
                                            ${progress === step.key ? 'animate-pulse-marker scale-110' : ''}
                                        `}>
                                            {step.icon}
                                        </div>
                                        <span className={`text-[10px] font-bold tracking-wide transition-colors duration-500 ${progress >= step.key ? 'text-[#a3d133]' : 'text-white/25'}`}>
                                            {step.shortTitle}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="flex-1 mx-2 mb-6">
                                            <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#a3d133] rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: progress > step.key ? '100%' : '0%' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Current Status Detail */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className={`p-3.5 rounded-xl transition-all duration-500 ${progress === 4
                                    ? 'bg-[#a3d133] text-[#0f1a0a] shadow-[0_0_25px_rgba(163,209,51,0.5)]'
                                    : 'bg-orange-500/15 text-orange-400'
                                    }`}>
                                    {STEPS.find(s => s.key === progress)?.icon || <Clock size={18} />}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">{currentStatus.title}</h3>
                                    <p className="text-xs font-medium text-white/40 mt-0.5">{currentStatus.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Driver Card */}
                    {progress >= 3 && (
                        <div className="bg-gradient-to-br from-[#1a2912] to-[#111f0b] rounded-[24px] p-5 border border-[#2a4018]/60 flex items-center justify-between animate-slideUp">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src="https://ui-avatars.com/api/?name=Somchai+Rider&background=a3d133&color=0f1a0a&bold=true&size=56"
                                        alt="Driver"
                                        className="w-14 h-14 rounded-2xl"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#a3d133] rounded-full flex items-center justify-center border-2 border-[#1a2912]">
                                        <Navigation size={10} className="text-[#0f1a0a] fill-[#0f1a0a]" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Somchai Delivery</h4>
                                    <div className="text-[11px] font-semibold text-white/40 flex items-center gap-1 mt-0.5">
                                        ⭐ 4.9 · 240 trips
                                    </div>
                                    <div className="text-[10px] font-bold text-[#a3d133] bg-[#a3d133]/10 px-2.5 py-0.5 rounded-lg inline-block mt-1.5 border border-[#a3d133]/20">
                                        Honda PCX · 1กข 1234
                                    </div>
                                </div>
                            </div>
                            <button className="w-12 h-12 rounded-2xl bg-[#a3d133] flex items-center justify-center text-[#0f1a0a] shadow-[0_0_20px_rgba(163,209,51,0.3)] hover:shadow-[0_0_30px_rgba(163,209,51,0.5)] transition-all active:scale-95">
                                <Phone size={20} fill="currentColor" />
                            </button>
                        </div>
                    )}

                    {/* Delivery Route Card */}
                    <div className="bg-gradient-to-br from-[#1a2912] to-[#111f0b] rounded-[24px] p-5 border border-[#2a4018]/60">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1 pt-1">
                                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                                <div className="w-px h-10 bg-gradient-to-b from-orange-500/50 to-[#a3d133]/50"></div>
                                <div className="w-3 h-3 rounded-full bg-[#a3d133] shadow-[0_0_10px_rgba(163,209,51,0.4)]"></div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Pickup Store</div>
                                    <h4 className="font-bold text-sm text-white">Wellmate Kitchen Center (Sukhumvit)</h4>
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Delivery Location</div>
                                    <h4 className="font-bold text-sm text-white">123/45 Health Avenue Condo</h4>
                                    <p className="text-[11px] font-medium text-white/30 mt-1">Note: Please leave it at the lobby.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-8"></div>
                </div>
            </div>

            {/* Delivered Celebration Overlay */}
            {progress === 4 && (
                <div className="fixed inset-0 z-[1003] pointer-events-none flex items-center justify-center animate-fadeIn">
                    <div className="absolute inset-0 bg-[#0f1a0a]/60 backdrop-blur-sm"></div>
                    <div className="relative text-center pointer-events-auto animate-bounce-step">
                        <div className="w-24 h-24 mx-auto mb-4 bg-[#a3d133] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(163,209,51,0.5)]">
                            <CheckCircle2 size={48} className="text-[#0f1a0a]" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Delivered!</h2>
                        <p className="text-white/50 font-medium text-sm">Enjoy your healthy meal 🎉</p>
                        <Link href="/" className="mt-6 inline-block bg-[#a3d133] text-[#0f1a0a] font-bold px-8 py-3 rounded-2xl hover:shadow-[0_0_25px_rgba(163,209,51,0.4)] transition-all active:scale-95">
                            Back to Home
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
