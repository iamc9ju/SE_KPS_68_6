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
    title: "การจัดการน้ำหนักและโรคเบาหวาน",
    rating: 4.9,
    reviews: 1846,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400",
    description:
      "เชี่ยวชาญด้านการจัดการน้ำหนักและดูแลโรคเบาหวาน นพ.พีระนุช ให้การบำบัดทางโภชนาการที่มีหลักฐานอ้างอิง บรรลุเป้าหมายสุขภาพที่ยั่งยืนผ่านแผนการดูแลที่ช่วยจัดการระดับน้ำตาลในเลือดและเพิ่มประสิทธิภาพสุขภาพของคุณ",
    education: [
      "Ph.D. in Clinical Nutrition, Mahidol University",
      "M.Sc. in Dietetics, Chulalongkorn University",
      "Certified Diabetes Educator (CDE)",
    ],
    experience: "12 years",
    specializations: [
      "Weight Management",
      "Diabetes Care",
      "Metabolic Syndrome",
      "Personalized Meal Planning",
    ],
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    languages: ["Thai", "English"],
  },
  {
    id: "pronchanok-phoolaikaw",
    name: "Dr. Pronchanok Phoolaikaw",
    title: "โภชนาการการกีฬา",
    rating: 4.75,
    reviews: 1260,
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=400",
    description:
      "เพิ่มประสิทธิภาพของคุณด้วยคำแนะนำจากผู้เชี่ยวชาญ นพ.พรชนก เชี่ยวชาญด้านโภชนาการการกีฬา ช่วยให้นักกีฬาและผู้ที่ต้องการปรับโภชนาการเพื่อความแข็งแรงและการฟื้นฟูสูงสุด",
    education: [
      "Ph.D. in Sport Science & Nutrition, Kasetsart University",
      "M.Sc. in Exercise Physiology, Mahidol University",
      "Certified Sports Nutritionist (CISSN)",
    ],
    experience: "9 years",
    specializations: [
      "Sport Nutrition",
      "Athletic Performance",
      "Body Composition",
      "Recovery Nutrition",
    ],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    languages: ["Thai", "English"],
  },
  {
    id: "krittiyawadee-phetthong",
    name: "Dr. Krittiyawadee Phetthong",
    title: "สุขภาพแม่และเด็ก",
    rating: 4.8,
    reviews: 1176,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400",
    description:
      "มอบการเริ่มต้นที่ดีที่สุดให้กับลูกน้อยของคุณ นพ.กฤติยาวดี เสนอแผนโภชนาการที่เอาใจใส่และปรับเฉพาะบุคคลสำหรับมารดาและเด็ก เพื่อให้แน่ใจว่าครอบครัวของคุณจะมีอนาคตที่แข็งแรง",
    education: [
      "Ph.D. in Maternal & Child Nutrition, Chulalongkorn University",
      "M.Sc. in Public Health Nutrition, Mahidol University",
      "Certified Lactation Counselor (CLC)",
    ],
    experience: "10 years",
    specializations: [
      "Prenatal Nutrition",
      "Postnatal Care",
      "Pediatric Nutrition",
      "Breastfeeding Support",
    ],
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    languages: ["Thai", "English"],
  },
];
