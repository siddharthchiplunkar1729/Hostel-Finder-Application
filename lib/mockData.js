export const hostels = [
    {
        id: 1,
        name: "Zostel Mumbai",
        location: "Mumbai, Maharashtra",
        description: "Vibrant backpacker hostel in the heart of Mumbai. Close to the airport and major attractions.",
        price: 899,
        rating: 4.8,
        amenities: ["Free WiFi", "AC", "Common Room", "Cafe", "Lockers"],
        images: ["/bed-types/single-study.svg", "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"],
        type: "Backpacker",
        gender: "Co-ed",
        messAvailable: true
    },
    {
        id: 2,
        name: "Student Pods Andheri",
        location: "Mumbai, Maharashtra",
        description: "Affordable student accommodation near Mumbai University. Quiet study zones and high-speed internet.",
        price: 6500,
        rating: 4.5,
        amenities: ["Study Room", "WiFi", "Laundry", "Mess", "24/7 Security"],
        images: ["/bed-types/twin-share.svg", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"],
        type: "Student",
        gender: "Boys",
        messAvailable: true
    },
    {
        id: 3,
        name: "The Backpackers Loft",
        location: "Delhi, New Delhi",
        description: "A cozy loft for travelers in Paharganj. Meet people from all over the world.",
        price: 550,
        rating: 4.2,
        amenities: ["Rooftop", "WiFi", "Kitchen", "Tours"],
        images: ["/bed-types/bunk-bed.svg", "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=800&q=80"],
        type: "Backpacker",
        gender: "Co-ed",
        messAvailable: false
    },
    {
        id: 4,
        name: "Campus Hive Girl's Hostel",
        location: "Pune, Maharashtra",
        description: "Modern co-living space for female students. Near Symbiosis. Safe and secure.",
        price: 8000,
        rating: 4.9,
        amenities: ["Gym", "Gaming Zone", "AC", "Meals Included", "Biometric Entry"],
        images: ["/bed-types/small-double.svg", "https://images.unsplash.com/photo-1522771753037-6333616235df?auto=format&fit=crop&w=800&q=80"],
        type: "Student",
        gender: "Girls",
        messAvailable: true
    },
    {
        id: 5,
        name: "Goa Beach Hostel",
        location: "Anjuna, Goa",
        description: "Party hostel right on the beach. Good vibes only.",
        price: 450,
        rating: 4.3,
        amenities: ["Bar", "Pool", "Beach Access", "WiFi"],
        images: ["/bed-types/single-study.svg", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"],
        type: "Backpacker",
        gender: "Co-ed",
        messAvailable: true
    },
    {
        id: 6,
        name: "Scholar's Den",
        location: "Bangalore, Karnataka",
        description: "Dedicated housing for engineering students in Koramangala. 24/7 Library access.",
        price: 7500,
        rating: 4.0,
        amenities: ["Library", "High-Speed WiFi", "Mess", "Shuttle Service"],
        images: ["/bed-types/twin-share.svg", "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80"],
        type: "Student",
        gender: "Boys",
        messAvailable: true
    },
    {
        id: 7,
        name: "Pink City Backpackers",
        location: "Jaipur, Rajasthan",
        description: "Traditional haveli turned into a social hostel. Rooftop yoga and chai.",
        price: 600,
        rating: 4.7,
        amenities: ["Yoga", "Rooftop Cafe", "WiFi", "Cultural Tours"],
        images: ["/bed-types/bunk-bed.svg", "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"],
        type: "Backpacker",
        gender: "Co-ed",
        messAvailable: true
    },
    {
        id: 8,
        name: "SafeHaven Ladies PG",
        location: "Mumbai, Maharashtra",
        description: "Premium paying guest accommodation for working women and students in Bandra.",
        price: 12000,
        rating: 4.6,
        amenities: ["AC", "Attached Washroom", "Housekeeping", "WiFi", "Security"],
        images: ["/bed-types/small-double.svg", "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"],
        type: "Student",
        gender: "Girls",
        messAvailable: false
    },
    {
        id: 9,
        name: "Himalayan Basecamp",
        location: "Manali, Himachal Pradesh",
        description: "For digital nomads and mountain lovers. Work with a view.",
        price: 1200,
        rating: 4.9,
        amenities: ["Heater", "Co-working Space", "Cafe", "Bonfire"],
        images: ["/bed-types/single-study.svg", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"],
        type: "Backpacker",
        gender: "Co-ed",
        messAvailable: true
    },
    {
        id: 10,
        name: "UniLiving Co-ed",
        location: "Delhi, New Delhi",
        description: "Modern cosmopolitan student living near North Campus.",
        price: 9000,
        rating: 4.1,
        amenities: ["Gym", "Common Lounge", "Mess", "Laundry"],
        images: ["/bed-types/twin-share.svg", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"],
        type: "Student",
        gender: "Co-ed",
        messAvailable: true
    },
    {
        id: 11,
        name: "TechHub Stay",
        location: "Hyderabad, Telangana",
        description: "Budget stay for interns and students in Hitech City.",
        price: 5500,
        rating: 3.8,
        amenities: ["WiFi", "Power Backup", "Mess", "Parking"],
        images: ["/bed-types/bunk-bed.svg", "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"],
        type: "Student",
        gender: "Boys",
        messAvailable: true
    },
    {
        id: 12,
        name: "Kerala Backwaters Hostel",
        location: "Alleppey, Kerala",
        description: "Relax by the water. Canoeing and local food experiences.",
        price: 700,
        rating: 4.5,
        amenities: ["Canoeing", "Kitchen", "WiFi", "Hammocks"],
        images: ["/bed-types/small-double.svg", "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80"],
        type: "Backpacker",
        gender: "Co-ed",
        messAvailable: true
    }
];

export const reviews = [];

export const stories = [
    {
        userName: "Ananya K.",
        userAvatar: "https://i.pravatar.cc/150?img=5",
        hostelName: "Zostel Mumbai",
        content: "Met the most amazing people here! The rooftop sessions and cafe vibes are unmatched. Perfect for solo travelers! 🌟",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80",
        category: "Experience"
    },
    {
        userName: "Rahul M.",
        userAvatar: "https://i.pravatar.cc/150?img=12",
        hostelName: "Campus Hive Girl's Hostel",
        content: "Super safe and clean! The biometric entry gave my parents peace of mind. Study room is a lifesaver during exams.",
        image: "https://images.unsplash.com/photo-1522771753037-6333616235df?auto=format&fit=crop&w=400&q=80",
        category: "Review"
    },
    {
        userName: "Priya S.",
        userAvatar: "https://i.pravatar.cc/150?img=9",
        hostelName: "Goa Beach Hostel",
        content: "Pro tip: Book the sunset yoga sessions! Also, try the local fish curry at the beach shack next door. Absolute bliss! 🧘‍♀️",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
        category: "Tip"
    },
    {
        userName: "Arjun P.",
        userAvatar: "https://i.pravatar.cc/150?img=15",
        hostelName: "Himalayan Basecamp",
        content: "Worked remotely from here for a month. The co-working space with mountain views is incredible. WiFi is solid!",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
        category: "Experience"
    },
    {
        userName: "Sneha R.",
        userAvatar: "https://i.pravatar.cc/150?img=20",
        hostelName: "Pink City Backpackers",
        content: "The cultural tours organized by the hostel are fantastic! Don't miss the rooftop chai sessions at sunset. 🌅",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80",
        category: "Tip"
    },
    {
        userName: "Karan L.",
        userAvatar: "https://i.pravatar.cc/150?img=8",
        hostelName: "Student Pods Andheri",
        content: "The mess food is actually good! Plus the 24/7 security and study zones make it ideal for late-night cramming.",
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80",
        category: "Review"
    },
    {
        userName: "Maya D.",
        userAvatar: "https://i.pravatar.cc/150?img=25",
        hostelName: "Kerala Backwaters Hostel",
        content: "Canoeing through the backwaters at sunrise is magical. The hammocks and sunset views are perfect for digital detox! 🛶",
        image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=400&q=80",
        category: "Experience"
    },
    {
        userName: "Vikram J.",
        userAvatar: "https://i.pravatar.cc/150?img=13",
        hostelName: "TechHub Stay",
        content: "Great value for money! Close to all the tech parks in Hitech City. The mess serves unlimited meals which is a huge plus.",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80",
        category: "Review"
    }
];

export const communities = [
    {
        name: "Solo Female Travelers",
        description: "A safe space for women traveling alone. Share tips, find travel buddies, and support each other!",
        memberCount: 2847,
        category: "Travel",
        icon: "👩‍🦰"
    },
    {
        name: "Digital Nomads India",
        description: "Remote workers exploring India. Discuss best coworking spaces, internet connectivity, and work-life balance.",
        memberCount: 1523,
        category: "Remote Work",
        icon: "💻"
    },
    {
        name: "Budget Backpackers",
        description: "Travel India on a shoestring! Share budget hacks, cheap eats, and affordable stays.",
        memberCount: 4192,
        category: "Travel",
        icon: "🎒"
    },
    {
        name: "College Students Network",
        description: "For students looking for affordable PGs and hostels near universities. Share reviews and recommendations!",
        memberCount: 3654,
        category: "Students",
        icon: "🎓"
    },
    {
        name: "Adventure Seekers",
        description: "For thrill-seekers and adrenaline junkies. Plan treks, water sports, and adventure activities together!",
        memberCount: 1876,
        category: "Adventure",
        icon: "🏔️"
    },
    {
        name: "Foodie Travelers",
        description: "Discover local cuisines, street food gems, and authentic dining experiences across India.",
        memberCount: 2931,
        category: "Travel",
        icon: "🍛"
    }
];
