const AbrirM = document.getElementById('AbrirM');
const cerrarM = document.getElementsByClassName('subir')
const modalA = document.getElementById('agregarM')

AbrirM.addEventListener('click',()=> {
    modalA.showModal();
})
cerrarM.addEventListener('click',()=>{
    modalA.close()
})

modalA.addEventListener('click',(evento)=>{
    if(evento.target=== modalA)
    {
        modalA.close();
    }
})