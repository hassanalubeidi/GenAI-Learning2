import parse from 'pdf-parse'

export default async function handler(req, res) {
if (req.method === 'POST') {
    const { base64Data } = req.body;

    try {
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        const pdfData = await parse(pdfBuffer);
        const text = pdfData.text;

        res.status(200).json({ text });
        } catch (error) {
            console.log(error)
        res.status(500).json({ error: 'Error parsing PDF', errorMessage: error });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}