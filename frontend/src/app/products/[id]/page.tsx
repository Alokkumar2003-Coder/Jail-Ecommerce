"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "../../../redux/hooks";
import { addToCart } from "../../../redux/cartSlice";
import { addToWishlist } from "../../../redux/wishlistSlice";
import api from "../../../utils/axios";
import ReviewForm from "../../../components/ReviewForm";
import Carousel from "../../../components/Carousel";

interface Review {
  id: number;
  rating: number;
  comment: string;
  user?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  createdAt: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  stock: number;
  rating: number;
  category: { name: string };
  reviews: Review[];
  brand?: string;
  model?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  warranty?: string;
  specifications?: Record<string, string>;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "/placeholder.png",
        quantity: 1,
      })
    );
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    dispatch(addToWishlist(product.id));
  };

  const handleReviewSubmitted = async () => {
    await fetchProduct();
    const reviews = await fetchReviews();
    if (product) {
      setProduct({
        ...product,
        reviews: reviews,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  const getSpecifications = () => {
    const specs = [];

    if (product?.brand) specs.push({ label: "Brand", value: product.brand });
    if (product?.model) specs.push({ label: "Model", value: product.model });
    if (product?.weight) specs.push({ label: "Weight", value: product.weight });
    if (product?.dimensions) specs.push({ label: "Dimensions", value: product.dimensions });
    if (product?.color) specs.push({ label: "Color", value: product.color });
    if (product?.material) specs.push({ label: "Material", value: product.material });
    if (product?.warranty) specs.push({ label: "Warranty", value: product.warranty });

    if (product?.specifications) {
      Object.entries(product.specifications).forEach(([key, value]) => {
        specs.push({ label: key, value: value as string });
      });
    }

    return specs;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found.</div>
      </div>
    );
  }

  const specifications = getSpecifications();
  const reviewCount = product.reviews?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* PRODUCT INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="w-full">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            className="w-full h-[500px] object-contain bg-white"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-sm text-gray-500">{product.category?.name}</p>

          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center">
            {renderStars(Math.round(product.rating || 0))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating?.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>

          <p className="text-gray-700">Stock: {product.stock}</p>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="flex-1 bg-gray-100 cursor-pointer text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
            >
              ❤️ Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* CAROUSEL */}
      <div className="mb-12">
        <Carousel />
      </div>

      {/* DESCRIPTION */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </section>

      {/* SPECIFICATIONS */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Product Specifications</h2>
        {specifications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {specifications.map((spec, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded shadow-sm">
                <dt className="text-sm font-semibold text-gray-600">
                  {spec.label}
                </dt>
                <dd className="text-md text-gray-900">{spec.value}</dd>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No specifications available for this product.</p>
        )}
      </section>

      {/* REVIEWS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Verified Customer Reviews</h2>

        <div className="mb-8">
          <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
        </div>

        {reviewCount === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {product.reviews?.map((review) => {
              const userName = review.user?.name || "Anonymous";
              const userAvatar = review.user?.avatar;
              const userInitial = userName.charAt(0).toUpperCase();

              return (
                <div
                  key={review.id}
                  className="bg-white border border-gray-100 shadow-md rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-semibold">
                          {userInitial}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{userName}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-2">{renderStars(review.rating)}</div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
