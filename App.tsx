import React, { useState, useEffect } from 'react';
// IMPORTS DE FIREBASE: Agregados para la conexión
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import { Tour, Product, Guide, VRExperience, UserProfile, Booking, CartItem, RetreatHouse } from './types';

// Translation Dictionary
const languages = [
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ZH', name: '中文', flag: '🇨🇳' }
];

const translations: Record<string, Record<string, string>> = {
    ES: {
        nav_tours: 'Tours',
        nav_gear: 'Equipos',
        nav_guides: 'Guías',
        nav_vr: 'Experiencias VR',
        nav_retreats: 'Casas Retiro',
        nav_club: 'Club',
        btn_login: 'Iniciar Sesión',
        btn_register: 'Registrarse',
        btn_logout: 'Cerrar Sesión',
        hero_title: 'Descubre aventuras extraordinarias en Perú y Latinoamérica',
        hero_subtitle: 'Tours de aventura, equipos especializados y guías certificados para experiencias únicas.',
        search_placeholder_dest: '¿A dónde quieres ir?',
        search_placeholder_date: 'Fechas',
        search_placeholder_act: 'Tipo de actividad',
        search_btn: 'Buscar aventuras',
        section_dept: 'Explora por Departamento',
        section_dept_sub: 'Encuentra tu próxima aventura en los destinos más impresionantes del Perú.',
        section_cat: 'Explora nuestras categorías',
        footer_explore: 'Explora',
        footer_info: 'Información',
        footer_contact: 'Contáctanos',
        club_join: 'Unirse al Club',
        club_benefits: 'Únete a la comunidad de aventureros más grande.',
        tours_featured: 'Tours destacados',
        view_all: 'Ver todos',
        role_user: 'Viajero',
        role_operator: 'Operador',
        role_guide: 'Guía',
        role_lodging: 'Casa de Retiro',
        login_title_user: 'Bienvenido, Viajero',
        login_title_operator: 'Portal de Operadores',
        login_title_guide: 'Acceso para Guías',
        login_title_lodging: 'Gestión de Casa de Retiro',
        // Profile Labels
        label_name: 'Nombre Completo',
        label_business_name: 'Razón Social',
        label_phone: 'Teléfono',
        label_bio: 'Biografía / Descripción',
        label_ruc: 'RUC',
        label_website: 'Sitio Web',
        label_address: 'Dirección Comercial',
        label_experience: 'Años de Experiencia',
        label_languages: 'Idiomas',
        label_certifications: 'Certificaciones',
        label_amenities: 'Servicios (Amenities)',
        label_interests: 'Intereses',
        label_lodging_type: 'Tipo de Alojamiento',
        save_changes: 'Guardar cambios',
        edit_profile: 'Editar Perfil',
        cart_title: 'Tu Carrito',
        cart_empty: 'Tu carrito está vacío',
        cart_total: 'Total Estimado',
        cart_checkout: 'Ir a Pagar',
        cart_remove: 'Eliminar',
        cart_summary: 'Resumen del pedido'
    },
    EN: {
        nav_tours: 'Tours',
        nav_gear: 'Gear',
        nav_guides: 'Guides',
        nav_vr: 'VR Experiences',
        nav_retreats: 'Retreat Houses',
        nav_club: 'Club',
        btn_login: 'Login',
        btn_register: 'Register',
        btn_logout: 'Logout',
        hero_title: 'Discover extraordinary adventures in Peru and Latin America',
        hero_subtitle: 'Adventure tours, specialized gear, and certified guides for unique experiences.',
        search_placeholder_dest: 'Where to go?',
        search_placeholder_date: 'Dates',
        search_placeholder_act: 'Activity type',
        search_btn: 'Search adventures',
        section_dept: 'Explore by Department',
        section_dept_sub: 'Find your next adventure in Peru\'s most stunning destinations.',
        section_cat: 'Explore our categories',
        footer_explore: 'Explore',
        footer_info: 'Information',
        footer_contact: 'Contact Us',
        club_join: 'Join the Club',
        club_benefits: 'Join the largest community of adventurers.',
        tours_featured: 'Featured Tours',
        view_all: 'View all',
        role_user: 'Traveler',
        role_operator: 'Operator',
        role_guide: 'Guide',
        role_lodging: 'Retreat House',
        login_title_user: 'Welcome, Traveler',
        login_title_operator: 'Operator Portal',
        login_title_guide: 'Guide Access',
        login_title_lodging: 'Retreat House Management',
        label_name: 'Full Name',
        label_business_name: 'Business Name',
        label_phone: 'Phone',
        label_bio: 'Bio / Description',
        label_ruc: 'Tax ID (RUC)',
        label_website: 'Website',
        label_address: 'Business Address',
        label_experience: 'Years of Experience',
        label_languages: 'Languages',
        label_certifications: 'Certifications',
        label_amenities: 'Amenities',
        label_interests: 'Interests',
        label_lodging_type: 'Lodging Type',
        save_changes: 'Save Changes',
        edit_profile: 'Edit Profile',
        cart_title: 'Your Cart',
        cart_empty: 'Your cart is empty',
        cart_total: 'Estimated Total',
        cart_checkout: 'Checkout',
        cart_remove: 'Remove',
        cart_summary: 'Order Summary'
    },
    FR: {
        nav_tours: 'Tours',
        nav_gear: 'Équipement',
        nav_guides: 'Guides',
        nav_vr: 'Expériences VR',
        nav_retreats: 'Maisons de Retraite',
        nav_club: 'Club',
        btn_login: 'Connexion',
        btn_register: "S'inscrire",
        btn_logout: 'Déconnexion',
        hero_title: 'Découvrez des aventures extraordinaires au Pérou et en Amérique latine',
        hero_subtitle: 'Tours d\'aventure, équipements spécialisés et guides certifiés.',
        search_placeholder_dest: 'Où voulez-vous aller ?',
        search_placeholder_date: 'Dates',
        search_placeholder_act: "Type d'activité",
        search_btn: 'Rechercher',
        section_dept: 'Explorer par Département',
        section_dept_sub: 'Trouvez votre prochaine aventure dans les destinations les plus impressionnantes.',
        section_cat: 'Explorer nos catégories',
        footer_explore: 'Explorer',
        footer_info: 'Information',
        footer_contact: 'Contactez-nous',
        club_join: 'Rejoindre le Club',
        club_benefits: 'Rejoignez la plus grande communauté d\'aventuriers.',
        tours_featured: 'Tours en vedette',
        view_all: 'Voir tout',
        role_user: 'Voyageur',
        role_operator: 'Opérateur',
        role_guide: 'Guide',
        role_lodging: 'Maison de Retraite',
        login_title_user: 'Bienvenue Voyageur',
        login_title_operator: 'Portail Opérateur',
        login_title_guide: 'Accès Guide',
        login_title_lodging: 'Gestion Maison de Retraite',
        label_name: 'Nom Complet',
        label_business_name: 'Raison Sociale',
        label_phone: 'Téléphone',
        label_bio: 'Biographie / Description',
        label_ruc: 'Numéro Fiscal (RUC)',
        label_website: 'Site Web',
        label_address: 'Adresse Commerciale',
        label_experience: "Années d'expérience",
        label_languages: 'Langues',
        label_certifications: 'Certifications',
        label_amenities: 'Équipements',
        label_interests: 'Intérêts',
        label_lodging_type: "Type d'hébergement",
        save_changes: 'Sauvegarder',
        edit_profile: 'Modifier le profil',
        cart_title: 'Votre Panier',
        cart_empty: 'Votre panier est vide',
        cart_total: 'Total Estimé',
        cart_checkout: 'Payer',
        cart_remove: 'Retirer',
        cart_summary: 'Résumé de la commande'
    },
    DE: {
        nav_tours: 'Touren',
        nav_gear: 'Ausrüstung',
        nav_guides: 'Führer',
        nav_vr: 'VR-Erlebnisse',
        nav_retreats: 'Retreat-Häuser',
        nav_club: 'Club',
        btn_login: 'Anmelden',
        btn_register: 'Registrieren',
        btn_logout: 'Abmelden',
        hero_title: 'Entdecken Sie außergewöhnliche Abenteuer in Peru und Lateinamerika',
        hero_subtitle: 'Abenteuertouren, Spezialausrüstung und zertifizierte Führer.',
        search_placeholder_dest: 'Wohin soll es gehen?',
        search_placeholder_date: 'Termine',
        search_placeholder_act: 'Aktivitätstyp',
        search_btn: 'Abenteuer suchen',
        section_dept: 'Erkunden nach Abteilung',
        section_dept_sub: 'Finden Sie Ihr nächstes Abenteuer in den atemberaubendsten Zielen.',
        section_cat: 'Unsere Kategorien',
        footer_explore: 'Erkunden',
        footer_info: 'Information',
        footer_contact: 'Kontakt',
        club_join: 'Club beitreten',
        club_benefits: 'Treten Sie der größten Abenteurer-Community bei.',
        tours_featured: 'Vorgestellte Touren',
        view_all: 'Alle anzeigen',
        role_user: 'Reisender',
        role_operator: 'Veranstalter',
        role_guide: 'Führer',
        role_lodging: 'Retreat-Haus',
        login_title_user: 'Willkommen Reisender',
        login_title_operator: 'Veranstalterportal',
        login_title_guide: 'Führerzugang',
        login_title_lodging: 'Hausverwaltung',
        label_name: 'Vollständiger Name',
        label_business_name: 'Firmenname',
        label_phone: 'Telefon',
        label_bio: 'Biografie / Beschreibung',
        label_ruc: 'Steuernummer (RUC)',
        label_website: 'Webseite',
        label_address: 'Geschäftsadresse',
        label_experience: 'Jahre Erfahrung',
        label_languages: 'Sprachen',
        label_certifications: 'Zertifizierungen',
        label_amenities: 'Ausstattung',
        label_interests: 'Interessen',
        label_lodging_type: 'Unterkunftstyp',
        save_changes: 'Änderungen speichern',
        edit_profile: 'Profil bearbeiten',
        cart_title: 'Ihr Warenkorb',
        cart_empty: 'Ihr Warenkorb ist leer',
        cart_total: 'Geschätzte Gesamtsumme',
        cart_checkout: 'Zur Kasse',
        cart_remove: 'Entfernen',
        cart_summary: 'Bestellübersicht'
    },
    ZH: {
        nav_tours: '游览',
        nav_gear: '装备',
        nav_guides: '向导',
        nav_vr: 'VR体验',
        nav_retreats: '静修所',
        nav_club: '俱乐部',
        btn_login: '登录',
        btn_register: '注册',
        btn_logout: '登出',
        hero_title: '探索秘鲁和拉丁美洲的非凡冒险',
        hero_subtitle: '探险游览、专业装备和认证向导，带来独特体验。',
        search_placeholder_dest: '你想去哪里？',
        search_placeholder_date: '日期',
        search_placeholder_act: '活动类型',
        search_btn: '搜索冒险',
        section_dept: '按地区探索',
        section_dept_sub: '在秘鲁最令人惊叹的目的地寻找您的下一次冒险。',
        section_cat: '探索我们的类别',
        footer_explore: '探索',
        footer_info: '信息',
        footer_contact: '联系我们',
        club_join: '加入俱乐部',
        club_benefits: '加入最大的冒险家社区。',
        tours_featured: '精选游览',
        view_all: '查看全部',
        role_user: '旅客',
        role_operator: '运营商',
        role_guide: '向导',
        role_lodging: '住宿',
        login_title_user: '欢迎旅客',
        login_title_operator: '运营商门户',
        login_title_guide: '向导入口',
        login_title_lodging: '住宿管理',
        label_name: '全名',
        label_business_name: '公司名称',
        label_phone: '电话',
        label_bio: '简介 / 描述',
        label_ruc: '税号 (RUC)',
        label_website: '网站',
        label_address: '商业地址',
        label_experience: '经验年限',
        label_languages: '语言',
        label_certifications: '认证',
        label_amenities: '设施',
        label_interests: '兴趣',
        label_lodging_type: '住宿类型',
        save_changes: '保存更改',
        edit_profile: '编辑个人资料',
        cart_title: '您的购物车',
        cart_empty: '您的购物车是空的',
        cart_total: '预计总额',
        cart_checkout: '结账',
        cart_remove: '移除',
        cart_summary: '订单摘要'
    }
};

// Departments Data
const departments = [
    { name: "Cusco", image: "https://image.pollinations.ai/prompt/Cusco%20plaza%20de%20armas%20cathedral%20colonial%20architecture%20mountains%20peru?width=600&height=400&nologo=true" },
    { name: "Ancash", image: "https://image.pollinations.ai/prompt/Huascaran%20mountain%20snow%20peak%20blue%20lake%20ancash%20peru%20landscape?width=600&height=400&nologo=true" },
    { name: "Arequipa", image: "https://image.pollinations.ai/prompt/Misti%20volcano%20Arequipa%20city%20white%20sillar%20architecture%20plaza?width=600&height=400&nologo=true" },
    { name: "Madre de Dios", image: "https://image.pollinations.ai/prompt/Amazon%20rainforest%20river%20aerial%20view%20green%20jungle%20peru%20tambopata?width=600&height=400&nologo=true" },
    { name: "Lima", image: "https://image.pollinations.ai/prompt/Lima%20coast%20miraflores%20cliffs%20ocean%20view%20larcomar%20paragliding?width=600&height=400&nologo=true" },
    { name: "Ica", image: "https://image.pollinations.ai/prompt/Huacachina%20oasis%20desert%20dunes%20sunset%20palm%20trees%20lagoon?width=600&height=400&nologo=true" }
];

// Helper to generate bulk data for all departments
const generateData = () => {
    let tours: Tour[] = [];
    let retreats: RetreatHouse[] = [];
    let equipments: Product[] = [];
    let guidesList: Guide[] = [];
    let vr: VRExperience[] = [];

    departments.forEach((dept, index) => {
        // Generate 6 Tours per department
        for (let i = 1; i <= 6; i++) {
            tours.push({
                id: parseInt(`${index}10${i}`),
                title: `Aventura ${i} en ${dept.name}`,
                location: dept.name,
                department: dept.name,
                category: i % 2 === 0 ? 'mistico' : 'adventure',
                price: 100 * i + 50,
                rating: 4.0 + (i * 0.1),
                reviews: 10 * i,
                image: `https://image.pollinations.ai/prompt/Adventure%20tour%20${dept.name}%20activity%20${i}%20peru?width=600&height=400&nologo=true`,
                difficulty: i % 3 === 0 ? 'AVANZADO' : 'INTERMEDIO'
            });
        }

        // Generate 3 Retreats per department
        for (let i = 1; i <= 3; i++) {
            retreats.push({
                id: parseInt(`${index}20${i}`),
                title: `Retiro ${i} ${dept.name}`,
                location: `Valle de ${dept.name}`,
                department: dept.name,
                pricePerNight: 200 * i,
                capacity: 10 + i,
                bedrooms: 5 + i,
                rating: 4.5 + (i * 0.1),
                amenities: ["Wifi", "Yoga", "Comida Vegana"],
                description: `Un espacio sagrado para conectar en ${dept.name}.`,
                image: `https://image.pollinations.ai/prompt/Luxury%20retreat%20house%20${dept.name}%20peru%20nature%20${i}?width=600&height=400&nologo=true`
            });
        }

        // Generate 10 Equipment items per department
        for (let i = 1; i <= 10; i++) {
            equipments.push({
                id: parseInt(`${index}30${i}`),
                title: `Equipo Pro ${i} - ${dept.name}`,
                description: `Alta calidad para clima de ${dept.name}`,
                department: dept.name,
                price: 50 * i,
                rating: 4.8,
                reviews: 5 * i,
                image: `https://image.pollinations.ai/prompt/Outdoor%20adventure%20gear%20equipment%20${i}%20${dept.name}?width=500&height=400&nologo=true`,
                isRental: i % 2 === 0,
                rentalPrice: `S/. ${10 * i}/día`
            });
        }

        // Generate 5 Guides per department
        for (let i = 1; i <= 5; i++) {
            guidesList.push({
                id: parseInt(`${index}40${i}`),
                name: `Guía ${dept.name} ${i}`,
                location: dept.name,
                department: dept.name,
                description: `Experto local con ${i + 3} años de experiencia en ${dept.name}.`,
                rating: 4.9,
                reviews: 12 * i,
                image: `https://image.pollinations.ai/prompt/Portrait%20local%20tour%20guide%20${dept.name}%20peru%20${i}?width=400&height=500&nologo=true`,
                languages: ["Español", "Inglés"],
                specialties: [{ name: "Trekking", color: "bg-blue-100 text-blue-800" }]
            });
        }

        // Generate 5 VR Experiences per department
        for (let i = 1; i <= 5; i++) {
            vr.push({
                id: parseInt(`${index}50${i}`),
                title: `VR ${dept.name} Exp ${i}`,
                department: dept.name,
                category: i % 2 === 0 ? '360' : 'Drone',
                description: `Sumérgete en los paisajes de ${dept.name} experiencia ${i}.`,
                duration: `${10 + i} min`,
                image: `https://image.pollinations.ai/prompt/VR%20experience%20landscape%20${dept.name}%20peru%20${i}?width=600&height=400&nologo=true`
            });
        }
    });

    return { tours, retreats, equipments, guidesList, vr };
};

const generatedData = generateData();
// RENOMBRAMOS LOS DATOS DE PRUEBA
const mockTours: Tour[] = generatedData.tours;
const mockRetreatHouses: RetreatHouse[] = generatedData.retreats;
const mockEquipmentProducts: Product[] = generatedData.equipments;
const mockGuides: Guide[] = generatedData.guidesList;
const mockVrExperiences: VRExperience[] = generatedData.vr;


type LoginRole = 'user' | 'operator' | 'guide' | 'lodging';

export const App: React.FC = () => {
    // 1. ESTADO DE TOURS: Empieza con los tours de prueba renombrados
    const [featuredTours, setFeaturedTours] = useState<Tour[]>(mockTours);

    // 2. LECTOR DE FIREBASE (Se ejecuta solo al iniciar la web)
    useEffect(() => {
        const cargarToursDeFirebase = async () => {
            try {
                console.log("Conectando a Firebase en busca de tours...");

                // BUSCA la colección llamada 'tours' (la que creaste)
                const toursCollection = collection(db, "tours");
                const snapshot = await getDocs(toursCollection);

                const toursDeLaNube = snapshot.docs.map(doc => {
                    const data = doc.data();

                    // Mapeamos (Traducimos) los datos de Firebase a la estructura de tu Tour
                    return {
                        id: doc.id,
                        title: data.title || "Tour Sin Título",
                        price: Number(data.price) || 0,
                        location: data.location || "Ubicación Desconocida",
                        department: data.department || "Cusco",
                        category: data.category || "adventure",
                        rating: Number(data.rating) || 5.0, // Asegúrate de que 'rating' sea Number
                        reviews: data.reviews || 0,
                        image: data.image || "https://image.pollinations.ai/prompt/placeholder%20mountain%20peru?width=600&height=400&nologo=true",
                        duration: data.duration || "1 día",
                        tag: "DB OK",
                        tagColor: "bg-red-500",
                        ...data
                    } as unknown as Tour;
                });

                if (toursDeLaNube.length > 0) {
                    console.log(`Tours cargados desde Firebase: ${toursDeLaNube.length}`);
                    // Reemplazamos los tours de prueba por los de Firebase
                    setFeaturedTours(toursDeLaNube);
                }
            } catch (error) {
                console.error("Error leyendo Firebase:", error);
            }
        };

        cargarToursDeFirebase();
    }, []); // El array vacío [ ] es esencial


    const [currentView, setCurrentView] = useState<'home' | 'search' | 'equipment' | 'guides' | 'vr' | 'retreats' | 'club'>('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [searchDepartment, setSearchDepartment] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<string>('');

    // Cart State
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Language State
    const [language, setLanguage] = useState<string>('ES');
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    // Helper for translations
    const t = (key: string) => translations[language][key] || translations['ES'][key] || key;

    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'saved'>('profile');
    const [loginRole, setLoginRole] = useState<LoginRole>('user');

    // Unified Filter logic - If selectedDepartment is set globally, it overrides everything
    const activeDepartment = selectedDepartment;

    // Filtros que ahora usan featuredTours (que es el estado dinámico)
    const filteredTours = featuredTours.filter(tour => {
        // If global department is selected, filter by it. Otherwise use view-specific filter if needed (or show all)
        const matchesGlobalDept = activeDepartment ? tour.department === activeDepartment : true;
        const matchesCategory = selectedCategory ? tour.category === selectedCategory : true;
        return matchesGlobalDept && matchesCategory;
    });

    const filteredEquipment = mockEquipmentProducts.filter(product => { // Usamos los mock de Equipment
        const matchesGlobalDept = activeDepartment ? product.department === activeDepartment : true;
        return matchesGlobalDept;
    });

    const filteredGuides = mockGuides.filter(guide => { // Usamos los mock de Guides
        const matchesGlobalDept = activeDepartment ? guide.department === activeDepartment : true;
        return matchesGlobalDept;
    });

    const filteredVR = mockVrExperiences.filter(vr => { // Usamos los mock de VR
        const matchesGlobalDept = activeDepartment ? vr.department === activeDepartment : true;
        return matchesGlobalDept;
    });

    const filteredRetreats = mockRetreatHouses.filter(retreat => { // Usamos los mock de Retreats
        const matchesGlobalDept = activeDepartment ? retreat.department === activeDepartment : true;
        return matchesGlobalDept;
    });

    const displayedTours = currentView === 'search' ? filteredTours : featuredTours.slice(0, 4); // Usamos los primeros 4 tours del estado (que son los de Firebase)

    // Cart Functions
    const addToCart = (item: Tour | Product | RetreatHouse, type: 'tour' | 'product' | 'retreat') => {
        const existingItem = cartItems.find(i => i.id === item.id && i.type === type);
        if (existingItem) {
            setCartItems(cartItems.map(i => i.id === item.id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            const price = 'price' in item ? item.price : (item as RetreatHouse).pricePerNight;
            setCartItems([...cartItems, {
                id: item.id,
                title: item.title,
                price: price,
                image: item.image,
                type,
                quantity: 1
            }]);
        }
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string | number, type: 'tour' | 'product' | 'retreat') => {
        setCartItems(cartItems.filter(i => !(i.id === id && i.type === type)));
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleSearch = () => {
        // If we search, we might set searchDepartment which can also update global selectedDepartment if desired
        if (searchDepartment) setSelectedDepartment(searchDepartment);
        setSelectedCategory(searchCategory);
        setCurrentView('search');
        window.scrollTo(0, 0);
    };

    const handleDepartmentClick = (deptName: string) => {
        setSelectedDepartment(deptName);
        // If we click a specific department, let's show the home view which will now be the "Department Dashboard"
        if (currentView !== 'home') setCurrentView('home');
        window.scrollTo(0, 0);
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setSearchCategory(category);
        setCurrentView('search');
        window.scrollTo(0, 0);
    }

    const handleLogin = (e?: React.FormEvent, provider?: 'google') => {
        if (e) e.preventDefault();

        let mockUser: UserProfile = {
            name: "Usuario Aventurero",
            email: loginEmail || "usuario@lifextreme.com",
            avatar: `https://ui-avatars.com/api/?name=Usuario+Aventurero&background=4F46E5&color=fff`,
            memberSince: "2024",
            status: "Free",
            role: loginRole,
            phone: "+51 900 000 000",
            location: "Lima, Perú",
            bio: "Explorador entusiasta.",
            interests: ["Trekking", "Fotografía"]
        };

        if (provider === 'google') {
            mockUser.name = "Daniela Morales";
            mockUser.email = "daniela@gmail.com";
            mockUser.avatar = "https://image.pollinations.ai/prompt/Portrait%20latin%20american%20woman%20smiling%20adventure%20clothes%20natural%20light?width=100&height=100&nologo=true";
        } else if (loginRole === 'operator') {
            mockUser.name = "Andes Expeditions SAC";
            mockUser.businessName = "Andes Expeditions SAC";
            mockUser.ruc = "20123456789";
            mockUser.address = "Av. El Sol 123, Cusco";
            mockUser.website = "www.andesexpeditions.com";
            mockUser.avatar = "https://image.pollinations.ai/prompt/Adventure%20company%20logo%20mountains%20professional?width=100&height=100&nologo=true";
        } else if (loginRole === 'guide') {
            mockUser.name = "Juan Pérez";
            mockUser.yearsExperience = 8;
            mockUser.certifications = ["UIAGM", "WFR"];
            mockUser.languages = ["Español", "Inglés", "Francés"];
            mockUser.avatar = "https://image.pollinations.ai/prompt/Mountain%20guide%20profile%20photo%20professional?width=100&height=100&nologo=true";
        } else if (loginRole === 'lodging') {
            mockUser.name = "Eco Lodge Valle";
            mockUser.businessName = "Eco Lodge Valle Sagrado EIRL";
            mockUser.lodgingType = "Lodge";
            mockUser.amenities = ["Wifi", "Desayuno", "Agua Caliente"];
            mockUser.avatar = "https://image.pollinations.ai/prompt/Eco%20lodge%20logo%20nature%20green?width=100&height=100&nologo=true";
        }

        setUser(mockUser);
        setIsLoggedIn(true);
        setCurrentView('club');
        window.scrollTo(0, 0);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setCurrentView('home');
        setLoginRole('user');
    };

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        setLangMenuOpen(false);
    };

    const StarRating = ({ rating, count }: { rating: number, count?: number }) => (
        <div className="flex items-center">
            <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`ri-star-${star <= Math.round(rating) ? 'fill' : 'line'}`}></i>
                ))}
            </div>
            {count !== undefined && <span className="text-sm text-gray-600 ml-1">({count} reseñas)</span>}
        </div>
    );

    return (
        <div className="bg-white min-h-screen font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('home'); setSelectedDepartment(''); setSelectedCategory(''); }} className="block">
                            <img src="https://image.pollinations.ai/prompt/LIFEXTREME%20typography%20logo%20text%20only%20white%20letters%20thick%20black%20outline%20high%20contrast%20white%20background%20clean%20vector%20style?width=600&height=150&fit=contain&nologo=true" alt="Lifextreme" className="h-12 md:h-14 w-auto object-contain" />
                        </a>
                        <nav className="hidden md:flex ml-10 space-x-6 items-center">

                            {/* Dropdown for Tours */}
                            <div className="relative group">
                                <button className="text-gray-700 hover:text-primary font-medium flex items-center transition-colors py-2">
                                    {t('nav_tours')} <i className="ri-arrow-down-s-line ml-1"></i>
                                </button>
                                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-56 hidden group-hover:block border border-gray-100 animate-fade-in z-50">
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelect(''); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                        {t('view_all')}
                                    </a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelect('adventure'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                                        Deportes de Aventura
                                    </a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleCategorySelect('mistico'); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary font-semibold text-purple-600 bg-purple-50">
                                        ✨ Tours Místicos
                                    </a>
                                </div>
                            </div>

                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('equipment'); window.scrollTo(0, 0); }} className="text-gray-700 hover:text-primary font-medium transition-colors">{t('nav_gear')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('guides'); window.scrollTo(0, 0); }} className="text-gray-700 hover:text-primary font-medium transition-colors">{t('nav_guides')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('retreats'); window.scrollTo(0, 0); }} className="text-gray-700 hover:text-primary font-medium transition-colors">{t('nav_retreats')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('vr'); window.scrollTo(0, 0); }} className="text-gray-700 hover:text-primary font-medium transition-colors">{t('nav_vr')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('club'); window.scrollTo(0, 0); }} className={`font-medium transition-colors ${currentView === 'club' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>{t('nav_club')}</a>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-3">

                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    className="flex items-center text-gray-700 hover:text-primary font-medium transition-colors"
                                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                                >
                                    <span className="mr-1">{languages.find(l => l.code === language)?.flag}</span>
                                    <span>{language}</span>
                                    <div className="w-5 h-5 flex items-center justify-center ml-1">
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>
                                </button>
                                {langMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-40 border border-gray-100 z-50">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-50 ${language === lang.code ? 'text-primary font-semibold' : 'text-gray-700'}`}
                                            >
                                                <span className="mr-2">{lang.flag}</span>
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isLoggedIn && user ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex flex-col items-end mr-1">
                                        <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                                        <span className="text-xs text-primary font-medium">{user.status}</span>
                                    </div>
                                    <button onClick={() => setCurrentView('club')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary focus:outline-none">
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => { setLoginRole('user'); setCurrentView('club'); }} className="bg-primary hover:bg-primary/90 transition-colors text-white py-2 px-4 rounded-button whitespace-nowrap font-medium">{t('btn_register')}</button>
                                </>
                            )}
                        </div>

                        {/* Cart Icon */}
                        <button
                            className="w-10 h-10 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <i className="ri-shopping-cart-2-line text-gray-700 text-xl"></i>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden w-10 h-10 flex items-center justify-center"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <i className="ri-menu-line text-xl"></i>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-lg z-50">
                        <nav className="flex flex-col space-y-4">
                            <div className="space-y-2">
                                <p className="font-semibold text-gray-900 border-b pb-1">{t('nav_tours')}</p>
                                <a href="#" onClick={() => { handleCategorySelect(''); setMobileMenuOpen(false); }} className="block pl-4 text-gray-600">Ver Todos</a>
                                <a href="#" onClick={() => { handleCategorySelect('adventure'); setMobileMenuOpen(false); }} className="block pl-4 text-gray-600">Deportes de Aventura</a>
                                <a href="#" onClick={() => { handleCategorySelect('mistico'); setMobileMenuOpen(false); }} className="block pl-4 text-purple-600 font-medium">✨ Tours Místicos</a>
                            </div>

                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('equipment'); window.scrollTo(0, 0); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-primary font-medium">{t('nav_gear')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('guides'); window.scrollTo(0, 0); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-primary font-medium">{t('nav_guides')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('retreats'); window.scrollTo(0, 0); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-primary font-medium">{t('nav_retreats')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('vr'); window.scrollTo(0, 0); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-primary font-medium">{t('nav_vr')}</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('club'); window.scrollTo(0, 0); setMobileMenuOpen(false); }} className="text-gray-700 hover:text-primary font-medium">{t('nav_club')}</a>

                            {/* Mobile Language Selector */}
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-2 uppercase">Idioma / Language</p>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`px-3 py-1 rounded-full text-sm border ${language === lang.code ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}
                                        >
                                            {lang.flag} {lang.code}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4 flex flex-col space-y-3">
                                {isLoggedIn ? (
                                    <button onClick={handleLogout} className="text-red-500 font-medium text-left">{t('btn_logout')}</button>
                                ) : (
                                    <>
                                        <button onClick={() => { setCurrentView('club'); setMobileMenuOpen(false); }} className="bg-primary text-white py-2 px-4 rounded-button font-medium w-full mt-2">{t('btn_register')}</button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Global Department Selector - Persistent */}
            <div className="bg-white border-b border-gray-100 sticky top-[72px] z-40 shadow-sm py-3 overflow-x-auto scrollbar-hide">
                <div className="container mx-auto px-4 flex items-center gap-4 min-w-max">
                    <button
                        onClick={() => { setSelectedDepartment(''); if (currentView !== 'home') setCurrentView('home'); }}
                        className="flex items-center text-gray-500 hover:text-primary font-medium text-sm transition-colors whitespace-nowrap"
                    >
                        <i className="ri-arrow-left-line mr-1"></i> Volver al inicio
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedDepartment('')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${selectedDepartment === '' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
                        >
                            Todos
                        </button>
                        {departments.map(dept => (
                            <button
                                key={dept.name}
                                onClick={() => handleDepartmentClick(dept.name)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${selectedDepartment === dept.name ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
                            >
                                {dept.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CART SIDEBAR - GODADDY STYLE */}
            <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                <div className={`relative bg-gray-50 w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    {/* Cart Header */}
                    <div className="p-5 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{t('cart_title')}</h2>
                            <p className="text-xs text-gray-500 mt-1">{cartItems.length} ítems en tu aventura</p>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600">
                            <i className="ri-close-line text-lg"></i>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="ri-shopping-bag-3-line text-4xl text-gray-400"></i>
                                </div>
                                <p className="text-lg font-medium text-gray-900 mb-2">{t('cart_empty')}</p>
                                <p className="text-sm text-gray-500 text-center max-w-xs mb-6">Parece que aún no has elegido tu próxima gran experiencia.</p>
                                <button onClick={() => setIsCartOpen(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                                    Explorar aventuras
                                </button>
                            </div>
                        ) : (
                            <>
                                {cartItems.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 transition-shadow hover:shadow-md">
                                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.title}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.type)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
                                                        title={t('cart_remove')}
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">
                                                    {item.type === 'tour' ? 'Tour' : item.type === 'retreat' ? 'Casa de Retiro' : 'Producto'}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-end mt-2">
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Cant: {item.quantity}</span>
                                                <span className="font-bold text-primary text-lg">S/. {item.price * item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Cart Footer / Checkout */}
                    {cartItems.length > 0 && (
                        <div className="bg-white border-t border-gray-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                            <h3 className="font-bold text-gray-900 mb-4">{t('cart_summary')}</h3>
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>S/. {cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Impuestos est.</span>
                                    <span>S/. {(cartTotal * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-900">{t('cart_total')}</span>
                                    <span className="font-bold text-2xl text-primary">S/. {(cartTotal * 1.18).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex justify-between items-center group"
                            >
                                <span>{t('cart_checkout')}</span>
                                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center">
                                <i className="ri-shield-check-line mr-1"></i> Pago 100% Seguro y Encriptado
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* VIEW: HOME */}
            {currentView === 'home' && (
                <>
                    {selectedDepartment ? (
                        /* --- DEPARTMENT DASHBOARD VIEW --- */
                        <div className="flex-1 bg-gray-50 min-h-screen">
                            {/* Department Hero */}
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={departments.find(d => d.name === selectedDepartment)?.image || "https://image.pollinations.ai/prompt/Peru%20landscape%20mountains?width=1200&height=600&nologo=true"}
                                    alt={selectedDepartment}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
                                    <h1 className="text-5xl font-['Pacifico'] mb-2">{selectedDepartment}</h1>
                                    <p className="text-xl max-w-2xl">Explora lo mejor de {selectedDepartment}: Tours, Retiros, Guías y más.</p>
                                </div>
                            </div>

                            <div className="container mx-auto px-4 py-12 space-y-16">

                                {/* Section: Tours (6 Items) */}
                                {filteredTours.length > 0 && (
                                    <section>
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Tours y Aventuras ({filteredTours.slice(0, 6).length})</h2>
                                                <p className="text-gray-600">Experiencias únicas en {selectedDepartment}</p>
                                            </div>
                                            <button onClick={() => setCurrentView('search')} className="text-primary hover:underline text-sm font-medium">Ver todos</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredTours.slice(0, 6).map(tour => (
                                                <div key={tour.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all group">
                                                    <div className="h-48 overflow-hidden relative">
                                                        <img src={tour.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                        <span className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold">S/. {tour.price}</span>
                                                        <span className="absolute top-2 left-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-bold">{tour.difficulty}</span>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-lg mb-1 truncate">{tour.title}</h3>
                                                        <div className="flex items-center text-xs text-gray-500 mb-3">
                                                            <i className="ri-map-pin-line mr-1 text-primary"></i> {tour.location}
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <StarRating rating={tour.rating} />
                                                            <button onClick={() => addToCart(tour, 'tour')} className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                                                                Reservar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section: Retreats (3 Items) */}
                                {filteredRetreats.length > 0 && (
                                    <section>
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Casas de Retiro ({filteredRetreats.slice(0, 3).length})</h2>
                                                <p className="text-gray-600">Descanso y conexión en {selectedDepartment}</p>
                                            </div>
                                            <button onClick={() => setCurrentView('retreats')} className="text-primary hover:underline text-sm font-medium">Ver todas</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {filteredRetreats.slice(0, 3).map(retreat => (
                                                <div key={retreat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                                                    <div className="h-56 relative">
                                                        <img src={retreat.image} className="w-full h-full object-cover" />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                            <h3 className="font-bold text-lg text-white">{retreat.title}</h3>
                                                            <p className="text-gray-200 text-xs"><i className="ri-map-pin-line mr-1"></i> {retreat.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="flex flex-wrap gap-1 mb-3">
                                                            {retreat.amenities.slice(0, 2).map((am, i) => (
                                                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{am}</span>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-bold text-primary text-lg">S/. {retreat.pricePerNight} <span className="text-xs text-gray-400 font-normal">/ noche</span></span>
                                                            <button onClick={() => addToCart(retreat, 'retreat')} className="text-sm font-medium text-gray-700 hover:text-primary border border-gray-200 px-3 py-1 rounded hover:border-primary transition-colors">Ver</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section: Equipment (10 Items) */}
                                {filteredEquipment.length > 0 && (
                                    <section>
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Equipamiento ({filteredEquipment.slice(0, 10).length})</h2>
                                                <p className="text-gray-600">Todo lo que necesitas para tu aventura</p>
                                            </div>
                                            <button onClick={() => setCurrentView('equipment')} className="text-primary hover:underline text-sm font-medium">Ver tienda</button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {filteredEquipment.slice(0, 10).map(item => (
                                                <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-md transition-all group">
                                                    <div className="h-32 bg-gray-50 rounded mb-3 overflow-hidden">
                                                        <img src={item.image} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                                                        {item.badge && (
                                                            <span className={`absolute top-4 left-4 ${item.badgeColor || 'bg-gray-800'} text-white text-xs font-bold px-2 py-1 rounded`}>
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1 truncate" title={item.title}>{item.title}</h4>
                                                    <p className="text-xs text-gray-500 mb-2 truncate">{item.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm font-bold text-primary">{item.isRental ? item.rentalPrice : `S/. ${item.price}`}</p>
                                                        <button onClick={() => addToCart(item, 'product')} className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary transition-colors">
                                                            <i className="ri-add-line"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section: Guides (5 Items) */}
                                {filteredGuides.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guías Certificados ({filteredGuides.slice(0, 5).length})</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                            {filteredGuides.slice(0, 5).map(guide => (
                                                <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform duration-300">
                                                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-primary/20">
                                                        <img src={guide.image} className="w-full h-full object-cover" />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1 truncate">{guide.name}</h4>
                                                    <div className="flex justify-center text-yellow-400 text-xs mb-2">
                                                        <i className="ri-star-fill"></i>
                                                        <span className="text-gray-500 ml-1">{guide.rating}</span>
                                                        <span className="text-gray-400 text-xs ml-1">({guide.reviews})</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{guide.description}</p>
                                                    <button onClick={() => setCurrentView('guides')} className="w-full py-1.5 border border-gray-200 text-gray-600 rounded text-xs font-medium hover:border-primary hover:text-primary transition-colors">
                                                        Contactar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section: VR Experiences (5 Items) */}
                                {filteredVR.length > 0 && (
                                    <section className="pb-8">
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Experiencias VR ({filteredVR.slice(0, 5).length})</h2>
                                                <p className="text-gray-600">Viaja sin moverte de casa</p>
                                            </div>
                                            <button onClick={() => setCurrentView('vr')} className="text-primary hover:underline text-sm font-medium">Ver galería</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {filteredVR.slice(0, 5).map(vr => (
                                                <div key={vr.id} className="group relative rounded-lg overflow-hidden cursor-pointer h-40" onClick={() => setCurrentView('vr')}>
                                                    <img src={vr.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center scale-90 group-hover:scale-110 transition-transform">
                                                            <i className="ri-play-fill text-white"></i>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                        <h4 className="text-white text-sm font-bold truncate">{vr.title}</h4>
                                                        <p className="text-gray-300 text-xs">{vr.duration}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            {/* Hero Section */}
                            <div className="relative h-[600px] flex items-center justify-center">
                                <div className="absolute inset-0">
                                    <img src="https://image.pollinations.ai/prompt/Peru%20mystic%20landscape%20adventure?width=1200&height=800&nologo=true" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40"></div>
                                </div>
                                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">{t('hero_title')}</h1>
                                    <p className="text-xl md:text-2xl mb-8 font-light">{t('hero_subtitle')}</p>

                                    {/* Search Bar */}
                                    <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-2">
                                            <i className="ri-map-pin-line text-gray-400 text-xl mr-2"></i>
                                            <input
                                                type="text"
                                                placeholder={t('search_placeholder_dest')}
                                                className="w-full p-2 outline-none text-gray-700"
                                                value={searchDepartment}
                                                onChange={(e) => setSearchDepartment(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1 flex items-center border-b md:border-b-0 md:border-r border-gray-200 px-2">
                                            <i className="ri-calendar-line text-gray-400 text-xl mr-2"></i>
                                            <input
                                                type="text"
                                                placeholder={t('search_placeholder_date')}
                                                className="w-full p-2 outline-none text-gray-700"
                                            />
                                        </div>
                                        <div className="flex-1 flex items-center px-2">
                                            <i className="ri-run-line text-gray-400 text-xl mr-2"></i>
                                            <select
                                                className="w-full p-2 outline-none text-gray-700 bg-transparent"
                                                value={searchCategory}
                                                onChange={(e) => setSearchCategory(e.target.value)}
                                            >
                                                <option value="">{t('search_placeholder_act')}</option>
                                                <option value="adventure">Aventura</option>
                                                <option value="mistico">Místico</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleSearch}
                                            className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-colors"
                                        >
                                            {t('search_btn')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Departments Grid */}
                            <section className="py-20 bg-gray-50">
                                <div className="container mx-auto px-4">
                                    <div className="text-center mb-16">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('section_dept')}</h2>
                                        <p className="text-xl text-gray-600">{t('section_dept_sub')}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {departments.map((dept) => (
                                            <div
                                                key={dept.name}
                                                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                                                onClick={() => handleDepartmentClick(dept.name)}
                                            >
                                                <img src={dept.image} alt={dept.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-colors">
                                                    <div className="absolute bottom-6 left-6 text-white transform group-hover:translate-y-[-5px] transition-transform">
                                                        <h3 className="text-2xl font-bold mb-1">{dept.name}</h3>
                                                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded backdrop-blur-sm">Explorar Destino <i className="ri-arrow-right-line ml-1"></i></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </>
            )}

            {currentView === 'vr' && (
                <section className="py-16 bg-gray-900 min-h-screen text-white">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
                            <div>
                                <button onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white mb-4 flex items-center transition-colors">
                                    <i className="ri-arrow-left-line mr-1"></i> Volver al inicio
                                </button>
                                <h2 className="text-4xl font-bold mb-2">Galería de Realidad Virtual {selectedDepartment ? `en ${selectedDepartment}` : ''}</h2>
                                <p className="text-gray-400 max-w-xl">Sumérgete en los paisajes más impresionantes del Perú.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredVR.map((vr) => (
                                <div key={vr.id} className="bg-gray-800 rounded-xl overflow-hidden group border border-gray-700">
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={vr.image} alt={vr.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                                <i className="ri-play-fill text-3xl"></i>
                                            </div>
                                        </div>
                                        <span className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                            {vr.category}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-white mb-1">{vr.title}</h3>
                                        <p className="text-gray-400 text-sm mb-3">{vr.description}</p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <i className="ri-time-line mr-1"></i> {vr.duration}
                                            <span className="mx-2">•</span>
                                            <i className="ri-eye-line mr-1"></i> {1200 + vr.id * 15} vistas
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {currentView === 'guides' && (
                <section className="py-16 bg-gray-50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-primary mb-4 flex items-center">
                            <i className="ri-arrow-left-line mr-1"></i> Volver al inicio
                        </button>
                        <h2 className="text-3xl font-bold mb-8">Encuentra a tu Guía Experto {selectedDepartment ? `en ${selectedDepartment}` : ''}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredGuides.map(guide => (
                                <div key={guide.id} className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow">
                                    <img src={guide.image} className="w-32 h-32 rounded-full object-cover mx-auto sm:mx-0 border-4 border-gray-100" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{guide.name}</h3>
                                            <div className="flex items-center text-yellow-400">
                                                <i className="ri-star-fill"></i>
                                                <span className="text-gray-700 font-bold ml-1">{guide.rating}</span>
                                                <span className="text-gray-400 text-xs ml-1">({guide.reviews})</span>
                                            </div>
                                        </div>
                                        <p className="text-primary font-medium text-sm mb-2"><i className="ri-map-pin-line mr-1"></i> {guide.location}</p>
                                        <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                                            {guide.specialties.map((spec, idx) => (
                                                <span key={idx} className={`text-xs px-2 py-1 rounded ${spec.color}`}>{spec.name}</span>
                                            ))}
                                        </div>
                                        <button className="w-full sm:w-auto bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary transition-colors">
                                            Contactar Guía
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {currentView === 'equipment' && (
                <section className="py-16 bg-gray-50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-primary mb-4 flex items-center">
                            <i className="ri-arrow-left-line mr-1"></i> Volver al inicio
                        </button>
                        <h2 className="text-3xl font-bold mb-8">Equipamiento {selectedDepartment ? `en ${selectedDepartment}` : ''}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredEquipment.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                    <div className="h-56 relative overflow-hidden bg-gray-100">
                                        <img src={item.image} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                                        {item.badge && (
                                            <span className={`absolute top-4 left-4 ${item.badgeColor || 'bg-gray-800'} text-white text-xs font-bold px-2 py-1 rounded`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-1 truncate" title={item.title}>{item.title}</h3>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-bold text-primary">{item.isRental ? item.rentalPrice : `S/. ${item.price}`}</p>
                                            <button
                                                onClick={() => addToCart(item, 'product')}
                                                className="bg-gray-900 hover:bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <i className="ri-shopping-cart-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {currentView === 'retreats' && (
                <section className="min-h-screen bg-gray-50">
                    {/* Hero for Retreats */}
                    <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: "url('https://image.pollinations.ai/prompt/Peaceful%20retreat%20yoga%20meditation%20nature%20peru%20mountains%20lake%20zen?width=1200&height=600&nologo=true')" }}>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center text-white p-4">
                                <h2 className="text-4xl md:text-5xl font-['Pacifico'] mb-4">Casas de Retiro</h2>
                                <p className="text-lg md:text-xl font-light">Espacios sagrados para conectar {selectedDepartment ? `en ${selectedDepartment}` : ''}</p>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-12">
                        <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-primary mb-8 flex items-center">
                            <i className="ri-arrow-left-line mr-1"></i> Volver al inicio
                        </button>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRetreats.map(retreat => (
                                <div key={retreat.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={retreat.image} alt={retreat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow">
                                            {retreat.department}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{retreat.title}</h3>
                                            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-yellow-800">
                                                <i className="ri-star-fill mr-1 text-yellow-500"></i>
                                                {retreat.rating}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4"><i className="ri-map-pin-line mr-1"></i> {retreat.location}</p>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{retreat.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {retreat.amenities.slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{amenity}</span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-gray-100 py-3">
                                            <div className="text-center border-r border-gray-100">
                                                <span className="block text-lg font-bold text-gray-800">{retreat.capacity}</span>
                                                <span className="text-xs text-gray-500">Personas</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-lg font-bold text-gray-800">{retreat.bedrooms}</span>
                                                <span className="text-xs text-gray-500">Habitaciones</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-500">Precio por noche</p>
                                                <p className="text-2xl font-bold text-primary">S/. {retreat.pricePerNight}</p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(retreat, 'retreat')}
                                                className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-transform hover:-translate-y-1"
                                            >
                                                Reservar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {currentView === 'search' && (
                <section className="py-8 bg-gray-50 min-h-screen">
                    <div className="container mx-auto px-4">
                        <button onClick={() => setCurrentView('home')} className="text-gray-500 hover:text-primary mb-4 flex items-center">
                            <i className="ri-arrow-left-line mr-1"></i> Volver al inicio
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Resultados de búsqueda {selectedDepartment ? `en ${selectedDepartment}` : ''}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {displayedTours.map(tour => (
                                <div key={tour.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-all">
                                    <img src={tour.image} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{tour.title}</h3>
                                            <span className={`text-[10px] px-2 py-1 rounded text-white font-bold ${tour.category === 'mistico' ? 'bg-purple-600' : 'bg-blue-600'}`}>{tour.category === 'mistico' ? 'Místico' : 'Aventura'}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mb-3">
                                            <i className="ri-map-pin-line mr-1"></i> {tour.location}, {tour.department}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-primary font-bold text-xl">S/. {tour.price}</p>
                                            <button
                                                onClick={() => addToCart(tour, 'tour')}
                                                className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-button text-sm font-medium transition-colors"
                                            >
                                                Reservar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* VIEW: CLUB (Authentication & Profile) */}
            {currentView === 'club' && (
                <section className="min-h-screen bg-gray-50">
                    {!isLoggedIn ? (
                        /* --- NON-LOGGED IN: Landing & Login --- */
                        <div className="flex flex-col lg:flex-row min-h-screen">
                            {/* Left: Branding & Benefits */}
                            <div className="lg:w-1/2 bg-gray-900 text-white p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute inset-0 z-0">
                                    <img src="https://image.pollinations.ai/prompt/Dark%20moody%20mountains%20starry%20night%20adventure%20camping%20bonfire?width=1000&height=1000&nologo=true" alt="Background" className="w-full h-full object-cover opacity-30" />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-['Pacifico'] text-primary">Club Lifextreme</h2>
                                    <p className="text-xl text-gray-300 mb-8">{t('club_benefits')}</p>

                                    <ul className="space-y-4 mb-12">
                                        {[
                                            "Acceso ilimitado a experiencias VR (8K)",
                                            "15% de descuento permanente en tours y equipos",
                                            "Prioridad en reservas de alta demanda",
                                            "Invitaciones a eventos y expediciones exclusivas"
                                        ].map((benefit, i) => (
                                            <li key={i} className="flex items-center text-gray-200">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 text-primary">
                                                    <i className="ri-check-line font-bold"></i>
                                                </div>
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <img key={i} className="w-10 h-10 rounded-full border-2 border-gray-900" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Member" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400">+2,500 miembros activos</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Login Form */}
                            <div className="lg:w-1/2 bg-white p-8 lg:p-16 flex flex-col justify-center">
                                <div className="max-w-md mx-auto w-full">

                                    {/* Role Selector Tabs */}
                                    <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setLoginRole('user')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${loginRole === 'user' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t('role_user')}
                                        </button>
                                        <button
                                            onClick={() => setLoginRole('operator')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${loginRole === 'operator' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t('role_operator')}
                                        </button>
                                        <button
                                            onClick={() => setLoginRole('guide')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${loginRole === 'guide' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t('role_guide')}
                                        </button>
                                        <button
                                            onClick={() => setLoginRole('lodging')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${loginRole === 'lodging' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {t('role_lodging')}
                                        </button>
                                    </div>

                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {t(`login_title_${loginRole}`)}
                                        </h3>
                                        <p className="text-gray-500">Ingresa tus datos para acceder a tu cuenta</p>
                                    </div>

                                    <button
                                        onClick={() => handleLogin(undefined, 'google')}
                                        className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-6 shadow-sm"
                                    >
                                        <i className="ri-google-fill text-xl text-red-500 mr-3"></i>
                                        Continuar con Google
                                    </button>

                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">O con tu correo</span>
                                        </div>
                                    </div>

                                    <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                                            <input
                                                type="email"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="ejemplo@correo.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                            <input
                                                type="password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <label className="flex items-center text-gray-600 cursor-pointer">
                                                <input type="checkbox" className="mr-2 custom-checkbox" /> Recordarme
                                            </label>
                                            <a href="#" className="text-primary hover:underline font-medium">¿Olvidaste tu contraseña?</a>
                                        </div>
                                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                                            {t('btn_login')}
                                        </button>
                                    </form>

                                    <p className="mt-8 text-center text-sm text-gray-600">
                                        ¿No tienes una cuenta? <a href="#" className="text-primary font-bold hover:underline">{t('btn_register')}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- LOGGED IN: User Dashboard --- */
                        <div className="container mx-auto px-4 py-12">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Sidebar Profile Card */}
                                <div className="lg:w-1/3">
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-24">
                                        <div className="h-32 bg-gradient-to-r from-primary to-purple-600 relative">
                                            <button onClick={handleLogout} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 p-2 rounded-full backdrop-blur-sm transition-colors" title={t('btn_logout')}>
                                                <i className="ri-logout-box-r-line"></i>
                                            </button>
                                        </div>
                                        <div className="px-8 pb-8">
                                            <div className="relative -mt-16 mb-4 flex justify-between items-end">
                                                <img src={user?.avatar} alt={user?.name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" />
                                                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 shadow-sm">
                                                    {user?.status}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                            <p className="text-gray-500 mb-4">{user?.email}</p>

                                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <i className="ri-map-pin-line mr-2 text-primary"></i> {user?.location || 'Sin ubicación'}
                                                </div>
                                                <div className="flex items-center">
                                                    <i className="ri-calendar-line mr-2 text-primary"></i> {user?.memberSince}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => setActiveTab('profile')}
                                                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <i className="ri-user-settings-line mr-3 text-lg"></i> {t('edit_profile')}
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('bookings')}
                                                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'bookings' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <i className="ri-compass-3-line mr-3 text-lg"></i> Mis Aventuras
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('saved')}
                                                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeTab === 'saved' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <i className="ri-heart-line mr-3 text-lg"></i> Favoritos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="lg:w-2/3">
                                    {/* PROFILE TAB - DYNAMIC BASED ON ROLE */}
                                    {activeTab === 'profile' && (
                                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-fade-in">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-gray-900">{t('edit_profile')} - {t(`role_${user?.role}`)}</h3>
                                                <button className="text-primary hover:underline text-sm">{t('save_changes')}</button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                {/* COMMON FIELDS */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_bio')}</label>
                                                    <textarea defaultValue={user?.bio} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50 resize-none"></textarea>
                                                </div>

                                                {/* USER / TRAVELER SPECIFIC */}
                                                {user?.role === 'user' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_name')}</label>
                                                            <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_phone')}</label>
                                                            <input type="text" defaultValue={user?.phone} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_interests')}</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['Trekking', 'Fotografía', 'VR', 'Escalada', 'Rafting', 'Camping'].map(interest => (
                                                                    <label key={interest} className="inline-flex items-center cursor-pointer">
                                                                        <input type="checkbox" className="hidden peer" defaultChecked={user?.interests?.includes(interest)} />
                                                                        <span className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-sm peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all select-none hover:bg-gray-50">{interest}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* OPERATOR & LODGING SPECIFIC */}
                                                {(user?.role === 'operator' || user?.role === 'lodging') && (
                                                    <>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_business_name')}</label>
                                                            <input type="text" defaultValue={user?.businessName} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_ruc')}</label>
                                                            <input type="text" defaultValue={user?.ruc} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_phone')}</label>
                                                            <input type="text" defaultValue={user?.phone} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_address')}</label>
                                                            <input type="text" defaultValue={user?.address} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_website')}</label>
                                                            <input type="text" defaultValue={user?.website} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                    </>
                                                )}

                                                {/* LODGING SPECIFIC EXTRAS */}
                                                {user?.role === 'lodging' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_lodging_type')}</label>
                                                            <select defaultValue={user?.lodgingType} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50">
                                                                <option value="Hotel">Hotel</option>
                                                                <option value="Hostel">Hostel</option>
                                                                <option value="Lodge">Lodge</option>
                                                                <option value="Glamping">Glamping</option>
                                                                <option value="Casa Retiro">Casa Retiro</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_amenities')}</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['Wifi', 'Desayuno', 'Agua Caliente', 'Piscina', 'Yoga Studio', 'Cocina'].map(amenity => (
                                                                    <label key={amenity} className="inline-flex items-center cursor-pointer">
                                                                        <input type="checkbox" className="hidden peer" defaultChecked={user?.amenities?.includes(amenity)} />
                                                                        <span className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-sm peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all select-none hover:bg-gray-50">{amenity}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* GUIDE SPECIFIC */}
                                                {user?.role === 'guide' && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_name')}</label>
                                                            <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('label_experience')}</label>
                                                            <input type="number" defaultValue={user?.yearsExperience} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50" />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_certifications')}</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['UIAGM', 'WFR', 'Guía Oficial', 'Primeros Auxilios'].map(cert => (
                                                                    <label key={cert} className="inline-flex items-center cursor-pointer">
                                                                        <input type="checkbox" className="hidden peer" defaultChecked={user?.certifications?.includes(cert)} />
                                                                        <span className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-sm peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all select-none hover:bg-gray-50">{cert}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('label_languages')}</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {['Español', 'Inglés', 'Quechua', 'Francés', 'Alemán'].map(lang => (
                                                                    <label key={lang} className="inline-flex items-center cursor-pointer">
                                                                        <input type="checkbox" className="hidden peer" defaultChecked={user?.languages?.includes(lang)} />
                                                                        <span className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 text-sm peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all select-none hover:bg-gray-50">{lang}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* BOOKINGS TAB */}
                                    {activeTab === 'bookings' && (
                                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-fade-in">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6">Mis Aventuras</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { id: 'BK-001', tourTitle: 'Camino Inca a Machu Picchu', date: '15 Mayo 2024', status: 'Confirmado', price: 1299, image: 'https://image.pollinations.ai/prompt/Machu%20Picchu%20ruins%20stone%20walls%20llamas%20mountains%20clouds%20inca%20trail%20hikers?width=100&height=100&nologo=true' },
                                                    { id: 'BK-002', tourTitle: 'Rafting en Río Urubamba', date: '20 Ene 2024', status: 'Completado', price: 349, image: 'https://image.pollinations.ai/prompt/River%20rafting%20Urubamba%20rapids%20splashing%20water%20action%20teamwork%20paddles%20helmet?width=100&height=100&nologo=true' }
                                                ].map(booking => (
                                                    <div key={booking.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                                                        <img src={booking.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                                                        <div className="flex-1 text-center sm:text-left">
                                                            <h4 className="font-bold text-gray-900">{booking.tourTitle}</h4>
                                                            <p className="text-sm text-gray-500">Fecha: {booking.date}</p>
                                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${booking.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                                                                    booking.status === 'Completado' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-primary">S/. {booking.price}</p>
                                                            <button className="text-sm text-gray-500 hover:text-primary underline">Ver detalles</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SAVED TAB */}
                                    {activeTab === 'saved' && (
                                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 animate-fade-in">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6">Lista de Deseos</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {featuredTours.slice(2, 4).map(tour => (
                                                    <div key={tour.id} className="border border-gray-100 rounded-lg overflow-hidden relative group">
                                                        <img src={tour.image} className="w-full h-32 object-cover" />
                                                        <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-white transition-colors">
                                                            <i className="ri-heart-fill"></i>
                                                        </button>
                                                        <div className="p-3">
                                                            <h4 className="font-bold text-sm line-clamp-1">{tour.title}</h4>
                                                            <p className="text-xs text-gray-500 mb-2">{tour.location}</p>
                                                            <button className="w-full bg-primary/10 text-primary text-xs font-bold py-2 rounded hover:bg-primary hover:text-white transition-colors">
                                                                Reservar Ahora
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            <Footer />
            <ChatWidget />
        </div>
    );
};

export default App;