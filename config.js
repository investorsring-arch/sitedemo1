/**
 * 🔐 CONFIGURATION SUPABASE - LEXIQUE DOUANIER
 * 
 * Ce fichier contient vos credentials Supabase
 * ⚠️ NE METTEZ JAMAIS CE FICHIER SUR GITHUB
 * Ajoutez config.js à .gitignore
 */

const SUPABASE_CONFIG = {
    // ✅ Project URL
    url: 'https://vfgjihkshhmnwjwbnrfz.supabase.co',
    
    // ✅ Anon Public Key
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZ2ppaGtzaGhtbndqd2JucmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTY2NzAsImV4cCI6MjA4OTc3MjY3MH0.5Fttwav2CqiVG8jOFeUuTYyPsFZiewr9uujCb4pXVVM',
    
    // ℹ️ Nom de la table (ne pas modifier)
    tableName: 'glossaire_douanier'
};

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
