module.exports = {
    i18n: {
        defaultLanguage: "en", // <<< change the default language here, remember to refresh the page after changing it

        languages: ["en", "it"],
        greetings: {
            en: {
                basic: ["Hi, {username}!", "Hello, {username}!", "Greetings, {username}!", "Welcome back, {username}!", "Hey, {username}!"],
                timed: {
                    morning: ["Good morning, {username}!", "Rise and shine, {username}!"],
                    afternoon: ["Good afternoon, {username}!", "How's your day going, {username}?"],
                    evening: ["Good evening, {username}!", "How was your day, {username}?"],
                    night: ["Good night, {username}!", "'night, {username}!", "Sleep well, {username}!"],
                },
            },
            it: {
                basic: ["Ciao, {username}!", "Salve, {username}!", "Ben tornato, {username}!", "Ehi, {username}!"],
                timed: {
                    morning: ["Buongiorno, {username}!", "Ben svegliato, {username}!", "Buona giornata, {username}!"],
                    afternoon: ["Buon pomeriggio, {username}!", "Pausa caffé, {username}?", "Come va, {username}?"],
                    evening: ["Buona sera, {username}!", "Come è andata la giornata, {username}?", "Buon riposo, {username}!"],
                    night: ["Buona notte, {username}!", "Notte, {username}!", "A domani, {username}!"],
                },
            },
        },
        translations: {
            en: {
                navMenu: {
                    dashboard: "Calendar",

                    settings: "Settings",
                    signOut: "Sign out",
                },

                dashboard: {
                    title: "🌷 💌 🐰",
                    // subtitle: "Summary of your data in the last month",
                },
            },
            it: {
                navMenu: {
                    dashboard: "Calendario",

                    settings: "Impostazioni",
                    signOut: "Esci",
                },

                dashboard: {
                    title: "🌷 💌 🐰 Calendario",
                    // subtitle: "Sommario dei tuoi dati nell'ultimo mese",
                },

            },
        },
    },
};
