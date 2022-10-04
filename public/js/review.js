// Add event listener on keyup
document.addEventListener('keyup', (event) => {
     window.location.replace('dashboard/process/id/'+db_id+'/mod/'+event.key);
}, false);
