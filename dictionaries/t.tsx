import { login, signup } from "@/components/api/v1/user";
import { event } from "firebase-functions/v1/analytics";
import type { Locale } from "i18n-config";

const tDictionary: Record<string, Record<Locale, string>> = {
  login: {
    en: "Login",
    fr: "Connexion",
    es: "Iniciar sesión",
    de: "Anmeldung",
    ar: "تسجيل الدخول",
    pt: "Entrar",
    ru: "Войти",
  },
  logout: {
    en: "Logout",
    fr: "Déconnexion",
    es: "Cerrar sesión",
    de: "Ausloggen",
    ar: "تسجيل الخروج",
    pt: "Sair",
    ru: "Выйти",
  },
  register: {
    en: "Register",
    fr: "S'inscrire",
    es: "Registrarse",
    de: "Registrieren",
    ar: "تسجيل",
    pt: "Registar",
    ru: "Регистрация",
  },
  home: {
    en: "Home",
    fr: "Accueil",
    es: "Casa",
    de: "Zuhause",
    ar: "الصفحة الرئيسية",
    pt: "Casa",
    ru: "Главная",
  },
  events: {
    en: "Events",
    fr: "Événements",
    es: "Eventos",
    de: "Veranstaltungen",
    ar: "أحداث",
    pt: "Eventos",
    ru: "События",
  },
  signUp: {
    en: "Signup",
    fr: "Inscription",
    es: "Registrarse",
    de: "Anmeldung",
    ar: "تسجيل",
    pt: "Registar",
    ru: "Регистрация",
  },
  signIn: {
    en: "Signin",
    fr: "Connexion",
    es: "Iniciar sesión",
    de: "Anmeldung",
    ar: "تسجيل الدخول",
    pt: "Entrar",
    ru: "Войти",
  },
  about: {
    en: "About",
    fr: "À propos",
    es: "Acerca de",
    de: "Über",
    ar: "حول",
    pt: "Sobre",
    ru: "О",
  },
  contact: {
    en: "Contact",
    fr: "Contacter",
    es: "Contacto",
    de: "Kontakt",
    ar: "اتصل",
    pt: "Contato",
    ru: "Контакт",
  },
  blog: {
    en: "Blog",
    fr: "Blog",
    es: "Blog",
    de: "Blog",
    ar: "مدونة",
    pt: "Blog",
    ru: "Блог",
  },
  search: {
    en: "Search",
    fr: "Chercher",
    es: "Buscar",
    de: "Suche",
    ar: "بحث",
    pt: "Procurar",
    ru: "Поиск",
  },
  terms: {
    en: "Terms",
    fr: "Termes",
    es: "Términos",
    de: "Bedingungen",
    ar: "شروط",
    pt: "Termos",
    ru: "Условия",
  },
  madeBy: {
    en: "Made by",
    fr: "Fabriqué par",
    es: "Hecho por",
    de: "Hergestellt von",
    ar: "صنع من قبل",
    pt: "Feito por",
    ru: "Сделано",
  },
  createAccount: {
    en: "Create Account",
    fr: "Créer un compte",
    es: "Crear cuenta",
    de: "Konto erstellen",
    ar: "إنشاء حساب",
    pt: "Criar conta",
    ru: "Создать аккаунт",
  },
  learn: {
    en: "Learn",
    fr: "Apprendre",
    es: "Aprender",
    de: "Lernen",
    ar: "تعلم",
    pt: "Aprender",
    ru: "Учить",
  },
  firstName: {
    en: "First Name",
    fr: "Prénom",
    es: "Nombre de pila",
    de: "Vorname",
    ar: "الاسم الاول",
    pt: "Primeiro nome",
    ru: "Имя",
  },
  lastName: {
    en: "Last Name",
    fr: "Nom de famille",
    es: "Apellido",
    de: "Familienname",
    ar: "الكنية",
    pt: "Último nome",
    ru: "Фамилия",
  },
  email: {
    en: "Email",
    fr: "Email",
    es: "Correo electrónico",
    de: "Email",
    ar: "البريد الإلكتروني",
    pt: "O email",
    ru: "Электронное письмо",
  },
  password: {
    en: "Password",
    fr: "Mot de passe",
    es: "Contraseña",
    de: "Passwort",
    ar: "كلمه السر",
    pt: "Senha",
    ru: "Пароль",
  },
  confirmPassword: {
    en: "Confirm Password",
    fr: "Confirmer le mot de passe",
    es: "Confirmar contraseña",
    de: "Passwort bestätigen",
    ar: "تأكيد كلمة المرور",
    pt: "Confirme a senha",
    ru: "Подтвердите пароль",
  },
  submit: {
    en: "Submit",
    fr: "Soumettre",
    es: "Enviar",
    de: "Einreichen",
    ar: "خضع",
    pt: "Enviar",
    ru: "Представить",
  },
  displayName: {
    en: "Display Name",
    fr: "Nom d'affichage",
    es: "Nombre para mostrar",
    de: "Anzeigename",
    ar: "اسم العرض",
    pt: "Nome de exibição",
    ru: "Отображаемое имя",
  },
  country: {
    en: "Country",
    fr: "Pays",
    es: "País",
    de: "Land",
    ar: "بلد",
    pt: "País",
    ru: "Страна",
  },
  save: {
    en: "Save",
    fr: "Sauvegarder",
    es: "Salvar",
    de: "Sparen",
    ar: "حفظ",
    pt: "Salve",
    ru: "Сохранить",
  },
  cancel: {
    en: "Cancel",
    fr: "Annuler",
    es: "Cancelar",
    de: "Stornieren",
    ar: "إلغاء",
    pt: "Cancelar",
    ru: "Отмена",
  },
  modify: {
    en: "Modify",
    fr: "Modifier",
    es: "Modificar",
    de: "Ändern",
    ar: "تعديل",
    pt: "Modificar",
    ru: "Изменить",
  },
  personalInfo: {
    en: "Personal Information",
    fr: "Informations personnelles",
    es: "Información personal",
    de: "Persönliche Informationen",
    ar: "معلومات شخصية",
    pt: "Informação pessoal",
    ru: "Личная информация",
  },
  changePassword: {
    en: "Change Password",
    fr: "Changer le mot de passe",
    es: "Cambiar la contraseña",
    de: "Passwort ändern",
    ar: "تغيير كلمة المرور",
    pt: "Alterar senha",
    ru: "Изменить пароль",
  },
  addPost: {
    en: "Add Post",
    fr: "Ajouter un message",
    es: "Agregar publicación",
    de: "Beitrag hinzufügen",
    ar: "أضف منشور",
    pt: "Adicionar postagem",
    ru: "Добавить сообщение",
  },
  createPost: {
    en: "Create Post",
    fr: "Créer un message",
    es: "Crear publicación",
    de: "Beitrag erstellen",
    ar: "إنشاء منشور",
    pt: "Criar postagem",
    ru: "Создать сообщение",
  },
  googleSignIn: {
    en: "Google Sign In",
    fr: "Connexion Google",
    es: "Inicio de sesión de Google",
    de: "Google-Anmeldung",
    ar: "تسجيل الدخول باستخدام Google",
    pt: "Entrar com o Google",
    ru: "Войти через Google",
  },
  facebookSignIn: {
    en: "Facebook Sign In",
    fr: "Connexion Facebook",
    es: "Inicio de sesión de Facebook",
    de: "Facebook-Anmeldung",
    ar: "تسجيل الدخول باستخدام Facebook",
    pt: "Entrar com o Facebook",
    ru: "Войти через Facebook",
  },
  welcome: {
    en: "Welcome",
    fr: "Bienvenue",
    es: "Bienvenido",
    de: "Herzlich willkommen",
    ar: "أهلا بك",
    pt: "Bem-vindo",
    ru: "Добро пожаловать",
  },
  loginToAccess: {
    en: "Login to continue to Mecofe",
    fr: "Connectez-vous pour continuer sur Mecofe",
    es: "Inicia sesión para continuar en Mecofe",
    de: "Melden Sie sich an, um mit Mecofe fortzufahren",
    ar: "تسجيل الدخول لمتابعة Mecofe",
    pt: "Faça login para continuar no Mecofe",
    ru: "Войдите, чтобы продолжить в Mecofe",
  },
  or: {
    en: "or",
    fr: "ou",
    es: "o",
    de: "oder",
    ar: "أو",
    pt: "ou",
    ru: "или",
  },
  popular: {
    en: "Popular",
    fr: "Populaire",
    es: "Popular",
    de: "Beliebt",
    ar: "شعبية",
    pt: "Popular",
    ru: "Популярный",
  },
  category: {
    en: "Categories",
    fr: "Catégories",
    es: "Categorías",
    de: "Kategorien",
    ar: "التصنيفات",
    pt: "Categorias",
    ru: "Категории",
  },
  daysAgo: {
    en: "days ago",
    fr: "il y a jours",
    es: "días atrás",
    de: "vor Tagen",
    ar: "منذ أيام",
    pt: "dias atrás",
    ru: "дней назад",
  },
  hoursAgo: {
    en: "hours ago",
    fr: "il y a heures",
    es: "horas atrás",
    de: "vor Stunden",
    ar: "منذ ساعات",
    pt: "horas atrás",
    ru: "часов назад",
  },
  minutesAgo: {
    en: "minutes ago",
    fr: "il y a minutes",
    es: "minutos atrás",
    de: "vor Minuten",
    ar: "منذ دقائق",
    pt: "minutos atrás",
    ru: "минут назад",
  },
  secondsAgo: {
    en: "seconds ago",
    fr: "il y a secondes",
    es: "segundos atrás",
    de: "vor Sekunden",
    ar: "منذ ثوان",
    pt: "segundos atrás",
    ru: "секунд назад",
  },
  noPosts: {
    en: "No posts found",
    fr: "Aucun article trouvé",
    es: "No se encontraron publicaciones",
    de: "Keine Beiträge gefunden",
    ar: "لم يتم العثور على منشورات",
    pt: "Nenhuma postagem encontrada",
    ru: "Посты не найдены",
  },
  ago: {
    en: "ago",
    fr: "il y a",
    es: "hace",
    de: "vor",
    ar: "منذ",
    pt: "atrás",
    ru: "назад",
  },
  view: {
    en: "View",
    fr: "Vue",
    es: "Ver",
    de: "Aussicht",
    ar: "رأي",
    pt: "Visão",
    ru: "Посмотреть",
  },
  views: {
    en: "Views",
    fr: "Vues",
    es: "Vistas",
    de: "Ansichten",
    ar: "الآراء",
    pt: "Visualizações",
    ru: "Просмотры",
  },
  latest: {
    en: "Latest",
    fr: "Dernières",
    es: "Más reciente",
    de: "Neueste",
    ar: "آخر",
    pt: "Último",
    ru: "Последний",
  },
};

export default tDictionary;
