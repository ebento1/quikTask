// Import the Offer model
import Offer from '../../models/entity'; // Adjust the path based on your project structure

// Function to find all offers
export const findAllOffers = async (req, res) => {
  try {
    const offers = await Off.findAll();
    return res.status(200).json({ success: true, data: offers });
  } catch (error) {
    console.error('Error in findAllOffers:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Function to find one offer by ID
export const findOneOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findOne({ where: { id: id } });

    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }

    return res.status(200).json({ success: true, data: offer });
  } catch (error) {
    console.error('Error in findOneOffer:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
