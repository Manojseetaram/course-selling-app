

// const calculateTotalPages = async (files) => {
//     let totalPages = 0;
    
//     for (let file of files) {
//         console.log(`Processing file: ${file.originalname}`); // Log the file name
        
//         if (file.mimetype === 'application/pdf') {
//             const pdfData = fs.readFileSync(file.path);
//             try {
//                 const pdf = await pdfParse(pdfData);
//                 console.log(`PDF Pages: ${pdf.numpages}`); // Log the number of pages in the PDF
//                 totalPages += pdf.numpages;
//             } catch (err) {
//                 console.error('Error parsing PDF:', err.message);
//             }
//         } else if (file.mimetype.startsWith('image')) {
//             totalPages += 1; // Each image is treated as one page
//         }
//     }
    
//     return totalPages;
// };
// module.exports = {
//      calculateTotalPages
// }