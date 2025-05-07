/**
 * Service untuk mengakses Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Perbaiki URL dan model
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Cache untuk menyimpan pesan-pesan sebelumnya untuk mengurangi panggilan API
const messageCache = [];
const MAX_CACHE_SIZE = 20;

/**
 * Mendapatkan kata-kata penyemangat dari Gemini API atau cache
 * @param {Object} gameContext - Informasi game untuk konteks
 * @returns {Promise<string>} - Kata-kata penyemangat
 */
export async function getMotivationalMessage(gameContext) {
  try {
    // 20% kemungkinan menggunakan cache jika tersedia
    if (messageCache.length > 0 && Math.random() < 0.2) {
      const randomIndex = Math.floor(Math.random() * messageCache.length);
      return messageCache[randomIndex];
    }

    const prompt = `
      Sebagai asisten coach dalam game PacMan, berikan kata-kata penyemangat untuk pemain.
      
      Informasi Game:
      - Skor pemain: ${gameContext.score || 0}
      - Jumlah hantu: ${gameContext.ghostCount || 1}
      - Dots tersisa: ${gameContext.dotsRemaining || 20}
      - Nyawa pemain: ${gameContext.lives || 3}
      
      Berikan kata penyemangat pendek (maksimal 80 karakter) yang lucu dan menarik dalam BAHASA INDONESIA.
      Kata-kata ini akan ditampilkan dengan HURUF KAPITAL dalam game retro PacMan.
      Jangan menggunakan tanda kutip dan tanpa pengantar apapun.
      
      Contoh format yang diharapkan:
      MAKAN SEMUA TITIK! HANTU TAK BISA MENGHENTIKANMU!
      TERUS MAJU! KAMU JUARANYA!
    `;

    console.log("Sending request to Gemini API...");
    
    // Tambahkan timeout untuk mengantisipasi API yang lambat
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 30,
            topK: 40,
            topP: 0.95,
          },
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error details:", errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      console.log("Gemini API response:", data);
      
      const message = data.candidates?.[0]?.content?.parts?.[0]?.text || "TERUS MAJU! KAMU PASTI BISA!";
      
      // Format pesan dan simpan di cache
      const formattedMessage = message.trim().toUpperCase().substring(0, 80);
      
      // Tambahkan ke cache
      if (!messageCache.includes(formattedMessage)) {
        messageCache.push(formattedMessage);
        // Batasi ukuran cache
        if (messageCache.length > MAX_CACHE_SIZE) {
          messageCache.shift(); // Hapus pesan tertua
        }
      }
      
      return formattedMessage;
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  } catch (error) {
    console.error("Error fetching Gemini message:", error);
    // Fallback messages bahasa Indonesia jika API gagal
    const fallbackMessages = [
      "MAKAN SEMUA TITIK! KALAHKAN HANTU!",
      "TERUS BERGERAK! JANGAN MENYERAH!",
      "KAU LUAR BIASA! TERUS KUMPULKAN POIN!",
      "HANTU-HANTU TAKUT PADAMU! LANJUTKAN!",
      "WAKKA WAKKA! KAMU HEBAT!",
      "MAKAN TITIK, HINDARI HANTU, SEDERHANA TAPI SERU!",
      "SATU DEMI SATU, KAU AKAN BERSIHKAN ARENA!",
      "TERUS BERGERAK! MEREKA TIDAK BISA MENANGKAPMU!",
      "LEGENDA PACMAN SEDANG DIBUAT!",
      "JANGAN BERHENTI! KAU HAMPIR MENANG!"
    ];
    
    const message = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    
    // Simpan fallback message di cache juga
    if (!messageCache.includes(message) && messageCache.length < MAX_CACHE_SIZE) {
      messageCache.push(message);
    }
    
    return message;
  }
}