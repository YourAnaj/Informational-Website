document.addEventListener('DOMContentLoaded', function() {
    const hasSubmenus = document.querySelectorAll('.has-submenu > a');

    hasSubmenus.forEach(parentLink => {
        parentLink.addEventListener('click', function(event) {
            event.preventDefault(); 

            const subDropdown = this.nextElementSibling; 

            if (subDropdown && subDropdown.classList.contains('sub-dropdown')) {

                document.querySelectorAll('.sub-dropdown.open').forEach(openDropdown => {
                    if (openDropdown !== subDropdown) {
                        openDropdown.classList.remove('open');
                    }
                });


                subDropdown.classList.toggle('open');
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content.open').forEach(openDropdown => {
                openDropdown.classList.remove('open');
            });
            document.querySelectorAll('.sub-dropdown.open').forEach(openDropdown => {
                openDropdown.classList.remove('open');
            });
        }
    });
});