const { CarbonFootprintData } = require('../CarbonFootprintData/carbonFootprintData');

const getCarbonFootprint = (req, res) => {
    const emailCounts = req.body;
    const totalCarbonFootprint = Object.keys(CarbonFootprintData).reduce((total, emailType) => {
        if (emailCounts[emailType]) {
            total += emailCounts[emailType] * CarbonFootprintData[emailType];
        }
        return total;
    }, 0);
    const totalCarbonFootprintKilograms =( totalCarbonFootprint / 1000).toFixed(4);;
    res.status(200).json({ message: `Carbon footprint: ${totalCarbonFootprintKilograms} Kg` });
}

module.exports = {
    getCarbonFootprint
};
