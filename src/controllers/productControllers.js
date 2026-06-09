import { Product } from "../models/productModel.js";

const getProducts = async (req, res) => {
  try {
    const userLogged = req.userLogged
    const filterProducts = await Product.find({ userId: userLogged.id }, { userId: 0 })
    res.json({
      success: true,
      data: filterProducts,
      message: "Products fetched successfully"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching products" })
  }
}

const getProduct = async (req, res) => {
  try {
    const id = req.params.id
    const foundProduct = await Product.findOne({
      _id: id,
      userId: req.userLogged.id
    }, {
      userId: 0
    })
    if (!foundProduct) return res.status(404).json({ success: false, error: "Not found" })
    res.json({ success: true, data: foundProduct, message: "Product fetched successfully" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" })
  }
}

const createProduct = async (req, res) => {
  try {
    const body = req.body
    const userLogged = req.userLogged

    if (body.stock === undefined) {
      return res.status(400).json({ success: false, error: "stock is required" })
    }

    if (body.name === undefined) {
      return res.status(400).json({ success: false, error: "name is required" })
    }

    const newProduct = await Product.create({
      name: body.name,
      price: body.price,
      category: body.category,
      stock: body.stock,
      available: body.stock > 0,
      userId: userLogged.id
    })

    // destructuring para eliminar el userId del objeto producto y quedarnos con el resto de la data
    const { userId, ...publicDataProduct } = newProduct.toObject()

    res.json({
      success: true,
      data: publicDataProduct,
      message: "Product created successfully"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error creating product" })
  }
}

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id
    const body = req.body

    const updateData = { ...body }
    if (body.stock !== undefined) {
      updateData.available = body.stock > 0
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, userId: req.userLogged.id },
      updateData,
      { new: true, projection: { userId: 0 } }
    )

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: "Product not found" })
    }

     const { userId, _id, ...publicDataProduct } = updatedProduct.toObject()

    res.json({
      success: true,
      data: publicDataProduct,
      message: "Product updated successfully"
    })
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" })
    }
    res.status(500).json({ success: false, error: e.message })
  }
}


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      userId: req.userLogged.id
    })

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: "Product not found" })
    }
    const productObj = deletedProduct.toObject()
    const { userId, ...publicDataProduct } = productObj

    res.json({ success: true, data: publicDataProduct, message: "Product deleted successfully" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" })
  }
}

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct }