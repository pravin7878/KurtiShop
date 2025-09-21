import User from '../models/user.js';

// Get or create user
export const getOrCreateUser = async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    let user = await User.findOne({ clerkId });
    
    if (!user) {
      user = new User({
        clerkId,
        email,
        name,
        addresses: [],
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting/creating user:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Get user by clerkId
export const getUserById = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Add address
export const addAddress = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const addressData = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }

    // If this address is set as default, unset other defaults
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(addressData);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { clerkId, addressId } = req.params;
    const addressData = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this address is set as default, unset other defaults
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    Object.assign(address, addressData);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { clerkId, addressId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    address.remove();

    // If we deleted the default address, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { clerkId, addressId } = req.params;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset all other defaults
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set this address as default
    address.isDefault = true;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
