function toggleInfo(element) {

    const allInfoSections = document.querySelectorAll('.member-info');
    

    allInfoSections.forEach(info => {
        if (info !== element.nextElementSibling) {
            info.classList.remove('show-info'); 
        }
    });
    

    const info = element.nextElementSibling;
    info.classList.toggle("show-info");
}
