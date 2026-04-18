document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadPdf');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const element = document.getElementById('cv-container');
            
            // Configuración optimizada para html2pdf
            const opt = {
                margin:       [0.2, 0, 0.2, 0], // top, left, bottom, right margins in inches
                filename:     'Curriculum_Miguel_Lopez_Perez.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                pagebreak:    { mode: ['css', 'legacy'] }, // Evita cortes de cajas de texto o tarjetas por la mitad
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: '#fdfbf7',
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: document.documentElement.offsetWidth // Force correct width calculations
                },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // Added a quick animation to the button to show processing
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Generando PDF...';
            downloadBtn.disabled = true;

            // Optional: You could scroll to the top before generating to ensure formatting is correct
            window.scrollTo(0, 0);

            // Generate the PDF
            html2pdf().set(opt).from(element).save().then(() => {
                // Restore button after saving
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }).catch(err => {
                console.error('Error al generar PDF:', err);
                
                // Fallback de seguridad si una imagen local o externa bloqueó la exportación (Error de CORS/Canvas Tainted)
                if (err.name === 'SecurityError' || err.toString().includes('Tainted')) {
                    alert("Por políticas de seguridad, las imágenes no permitieron transformar el PDF de forma automática al abrir el archivo directamente (Error de Canvas).\n\nA continuación, se abrirá la ventana de impresión nativa segura: por favor, selecciona 'Guardar como PDF' como destino para obtener tu CV impecable con fotos.");
                    window.print();
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                } else {
                    downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> Error';
                    setTimeout(() => {
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                    }, 3000);
                }
            });
        });
    }
});
