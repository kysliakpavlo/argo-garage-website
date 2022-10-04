// Add event listener on keyup
document.addEventListener('keyup', (event) => {
     if (event.key.match(/[bcfj123]/g)) {
          window.location.replace('/dashboard/process/id/'+db_id+'/mod/'+event.key);
     }     
}, false);
