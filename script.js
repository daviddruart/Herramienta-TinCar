function toggleContent(id) {
    let sections = document.querySelectorAll('.content');
    sections.forEach(sec => sec.computedStyleMap.display = 'none');
    document.getElementById(id).style.display = 'block'; 
}