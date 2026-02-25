export interface Nutritionist {
    id: string;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    education: string[];
    experience: string;
    specializations: string[];
    availableDays: string[];
    languages: string[];
}

export const nutritionists: Nutritionist[] = [
    {
        id: "peeronuch-thepwong",
        name: "Dr. Peeronuch Thepwong",
        title: "Weight Management & Diabetes",
        rating: 4.9,
        reviews: 1846,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
        description: "Specializing in weight management and diabetes care, Dr. Peeranuch Thapwong provides evidence-based medical nutrition therapy tailored to each unique needs. Achieve sustainable health goals through personalized plans designed to manage blood sugar and optimize your well-being.",
        education: [
            "Ph.D. in Clinical Nutrition, Mahidol University",
            "M.Sc. in Dietetics, Chulalongkorn University",
            "Certified Diabetes Educator (CDE)"
        ],
        experience: "12 years",
        specializations: ["Weight Management", "Diabetes Care", "Metabolic Syndrome", "Personalized Meal Planning"],
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        languages: ["Thai", "English"]
    },
    {
        id: "pronchanok-phoolaikaw",
        name: "Dr. Pronchanok Phoolaikaw",
        title: "Sport Nutrition",
        rating: 4.75,
        reviews: 1260,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
        description: "Fuel your performance with expert guidance. Dr. Pronchanok specializes in Sport Nutrition, helping athletes and active individuals optimize their diet for maximum strength and recovery.",
        education: [
            "Ph.D. in Sport Science & Nutrition, Kasetsart University",
            "M.Sc. in Exercise Physiology, Mahidol University",
            "Certified Sports Nutritionist (CISSN)"
        ],
        experience: "9 years",
        specializations: ["Sport Nutrition", "Athletic Performance", "Body Composition", "Recovery Nutrition"],
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        languages: ["Thai", "English"]
    },
    {
        id: "krittiyawadee-phetthong",
        name: "Dr. Krittiyawadee Phetthong",
        title: "Maternal Child Health",
        rating: 4.8,
        reviews: 1176,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
        description: "Give your little ones the best start in life. Dr. Krittiyawadee offers compassionate, personalized nutrition plans for mothers and children to ensure a healthy future for your family.",
        education: [
            "Ph.D. in Maternal & Child Nutrition, Chulalongkorn University",
            "M.Sc. in Public Health Nutrition, Mahidol University",
            "Certified Lactation Counselor (CLC)"
        ],
        experience: "10 years",
        specializations: ["Prenatal Nutrition", "Postnatal Care", "Pediatric Nutrition", "Breastfeeding Support"],
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
        languages: ["Thai", "English"]
    }
];
