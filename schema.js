const {mongoose} = require('./db');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
});

const imageSchema = new mongoose.Schema({
  url: String,
  width: String,
  height: String
}, { _id: false });

const metadataSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed
}, { _id: false });

const catalogNumberListSchema = new mongoose.Schema({
  CatalogNumberListElement: [String]
}, { _id: false });

const upcListSchema = new mongoose.Schema({
  UPCListElement: [String]
}, { _id: false });

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  images: {
    small: imageSchema,
    medium: imageSchema,
    large: imageSchema
  },
  description: [String],
  metadata: [metadataSchema],
  binding: String,
  brand: String,
  catalognumberlist: catalogNumberListSchema,
  ean: String,
  esrbagerating: String,
  feature: [String],
  format: String,
  genre: String,
  hardwareplatform: String,
  label: String,
  price: Number,
  currency: String,
  manufacturer: String,
  model: String,
  mpn: String,
  numberofitems: Number,
  operatingsystem: String,
  packagequantity: String,
  partnumber: String,
  platform: [String],
  productgroup: String,
  producttypename: String,
  publisher: String,
  releasedate: Date,
  studio: String,
  title: String,
  upc: String,
  upclist: upcListSchema,
  category: String,
  salesrank: Number
});

const cartSchema = new mongoose.Schema({
  email: String,
  productId: String,
  quantity: Number
});

const wishlistSchema = new mongoose.Schema({
  email: String,
  productId: String,
});


const userSchemaModel = mongoose.model('users', userSchema);
const productSchemaModel = mongoose.model('Products', productSchema);
const cartSchemaModel = mongoose.model('cart', cartSchema);
const wishlistSchemaModel = mongoose.model('wishlist', wishlistSchema);

module.exports = {
    userSchemaModel,
    productSchemaModel,
    cartSchemaModel,
    wishlistSchemaModel,
};

