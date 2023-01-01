// Add event listener on keyup
document.addEventListener('keyup', (event) => {
     if ( (event.key.length === 1) && event.key.match(/[bcfudrlj]/g)) {  // 
          window.location.replace('/dashboard/process/id/'+db_id+'/mod/'+event.key);
     }     
}, false);
