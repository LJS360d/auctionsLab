
setLoadingScreen()
window.onload = setRandomFont
document.addEventListener('click',setRandomFont)
function setLoadingScreen() {
    const loadingScreen = document.createElement('div')
    loadingScreen.innerHTML += `
    <div class="loading-icon-container">
        <div class="loading-icon"></div>
    </div>
    <div class="loading-text">
        <span class="shaky-loading">Loading</span>
        <span class="dots">...</span>
    </div>`;
    loadingScreen.className = "loading-screen"
    document.body.appendChild(loadingScreen)
}
function setRandomFont() {
    const fonts = [
        "The Alaska",
        "wingdings",
        "Comic Sans MS",
        "Brush Script MT",
        "Lucida Handwriting",
        "Segoe Script",
        "Freestyle Script",
        "Marker Felt",
        "Chalkduster",
        "Snell Roundhand",
        "Kristen ITC",
        "Cursed Timer ULiL",
        "Kalam",
        "Algeria",
        "KAPITAL KANJI",
        "Jokerman",
        "Viner Hand ITC",
        "Among Us"
    ];
    document.querySelector('.loading-text').style.setProperty('font-family', fonts[Math.floor(Math.random() * fonts.length)])
}
