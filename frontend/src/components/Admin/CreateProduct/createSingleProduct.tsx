import { useState, useEffect, use } from "react";
import Link from "next/link";
import Thumbnail from "./thumbnail";
import ProductDetails from "./productDetails";
import General from "./general";
import UnitAndPrice from "./unitPrice";
import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";
import Toast from "@/components/Toast/toast";
import { useToast } from "@/providers/toastProvider";

const CreateSingleProduct = () => {
  const unitOptions: string[] = ["Gói", "Hộp", "Viên"];

  const { addProduct } = useProduct();

  interface PriceItem {
    original_price: number;
    unit_price: string;
    discount: number;
    unit: string;
    amount: number;
    amount_per_unit: string;
  }

  interface IngredientItem {
    ingredient_name: string;
    ingredient_amount: string;
  }

  interface Manufacturer {
    manufacture_name: string;
    manufacture_address: string;
    manufacture_contact: string;
  }

  interface Category {
    main_category_name: string;
    main_category_slug: string;
    child_category_name: string;
    child_category_slug: string;
    sub_category_name: string;
    sub_category_slug: string;
    main_category_id: string;
    child_category_id: string;
    sub_category_id: string;
  }

  const [prices, setPrices] = useState<PriceItem[]>([
    { original_price: 0, unit_price: "", discount: 0, unit: "", amount: 0, amount_per_unit: "" }
  ]);

  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { ingredient_name: "", ingredient_amount: "" }
  ]);

  const [manufacturer, setManufacturer] = useState<Manufacturer>({
    manufacture_name: "",
    manufacture_address: "",
    manufacture_contact: ""
  });


  const [category, setCategory] = useState<Category>({
    main_category_name: "",
    main_category_slug: "",
    child_category_name: "",
    child_category_slug: "",
    sub_category_name: "",
    sub_category_slug: "",
    main_category_id: "",
    child_category_id: "",
    sub_category_id: ""
  });

  const [productName, setProductName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const toast = useToast();

  // Add state for managing images
  const [images, setImages] = useState<File[]>([]);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>("");

  // Add state for validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to generate a slug from product name with Vietnamese character support
  const generateSlug = (title: string): string => {
    let slug = title.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
  };

  useEffect(() => {
    if (productName) {
      setSlug(generateSlug(productName));
    }
  }, [productName]);

  const addPriceItem = () => {
    setPrices([...prices, {
      original_price: 0,
      unit_price: "",
      discount: 0,
      unit: "",
      amount: 0,
      amount_per_unit: ""
    }]);
  };

  const removePriceItem = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const updatePriceItem = (index: number, field: keyof PriceItem, value: string | number) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setPrices(updatedPrices);
  };

  const addIngredientItem = () => {
    setIngredients([...ingredients, { ingredient_name: "", ingredient_amount: "" }]);
  };

  const removeIngredientItem = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredientItem = (index: number, field: keyof IngredientItem, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setIngredients(updatedIngredients);
  };

  // Enhanced image handlers
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Add new files to existing images
      const fileArray = Array.from(e.target.files);
      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages);

      // Generate preview URLs for new files
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImagePreviewUrls(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files)
        .filter(file => file.type.includes('image'));

      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages);

      // Generate preview URLs
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImagePreviewUrls(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrimaryImage(file);

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPrimaryImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviewUrls];
    newPreviews.splice(index, 1);
    setImagePreviewUrls(newPreviews);
  };

  const removePrimaryImage = () => {
    setPrimaryImage(null);
    setPrimaryImagePreview("");
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate basic information
    if (!productName) newErrors.product_name = "Product name is required";
    if (!slug) newErrors.slug = "Slug is required";

    // Validate category selection
    if (!category.main_category_id) newErrors.main_category = "Please select a main category";

    // Validate prices
    if (prices.length === 0) {
      newErrors.prices = "At least one price option is required";
    } else {
      const priceErrors: string[] = [];
      prices.forEach((price, index) => {
        if (!price.unit) priceErrors.push(`Option ${index + 1}: Unit is required`);
        if (price.original_price <= 0) priceErrors.push(`Option ${index + 1}: Original price must be greater than 0`);
      });
      if (priceErrors.length > 0) {
        newErrors.prices = priceErrors.join("; ");
      }
    }

    // Validate ingredients
    const ingredientErrors: string[] = [];
    ingredients.forEach((ingredient, index) => {
      if (!ingredient.ingredient_name) ingredientErrors.push(`Ingredient ${index + 1}: Name is required`);
    });
    if (ingredientErrors.length > 0) {
      newErrors.ingredients = ingredientErrors.join("; ");
    }

    // Validate manufacturer
    if (!manufacturer.manufacture_name) newErrors.manufacture_name = "Manufacturer name is required";

    // Validate product details
    if (!document.querySelector<HTMLTextAreaElement>('textarea[name="description"]')?.value)
      newErrors.description = "Description is required";
    if (!document.querySelector<HTMLTextAreaElement>('textarea[name="uses"]')?.value)
      newErrors.uses = "Uses information is required";
    if (!document.querySelector<HTMLInputElement>('input[name="dosage_form"]')?.value)
      newErrors.dosage_form = "Dosage form is required";

    // Validate images
    if (images.length === 0) newErrors.images = "Please upload at least one product image";
    if (!primaryImage) newErrors.images_primary = "Please upload a primary product image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
    setFormSubmitted(true);
    
    const isValid = validateForm();
    if (!isValid) {
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const formData = new FormData(e.currentTarget);

    formData.delete('images');
    formData.delete('images_primary');

    images.forEach(image => {
      formData.append('images', image);
    });

    if (primaryImage) {
      formData.append('images_primary', primaryImage);
    }

    formData.set('ingredients', JSON.stringify({ ingredients }));
    formData.set('prices', JSON.stringify({ prices }));
    formData.set('manufacturer', JSON.stringify(manufacturer));
    formData.set('category', JSON.stringify(category));

    const formDataObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    await addProduct(
      formDataObj,
      (message: any) => {
        toast.showToast(message, "success");
        resetForm(e.currentTarget as HTMLFormElement);
      },
      (message: any) => {
        toast.showToast(message, "error");
      });
  };

  const resetForm = (form: HTMLFormElement) => {
    // Reset form element
    form.reset();
    
    // Reset React state
    setProductName("");
    setSlug("");
    setPrices([{ original_price: 0, unit_price: "", discount: 0, unit: "", amount: 0, amount_per_unit: "" }]);
    setIngredients([{ ingredient_name: "", ingredient_amount: "" }]);
    setManufacturer({
      manufacture_name: "",
      manufacture_address: "",
      manufacture_contact: ""
    });
    setCategory({
      main_category_name: "",
      main_category_slug: "",
      child_category_name: "",
      child_category_slug: "",
      sub_category_name: "",
      sub_category_slug: "",
      main_category_id: "",
      child_category_id: "",
      sub_category_id: ""
    });
    
    // Reset category selections
    setSelectedMainCategory("");
    setSelectedSubCategory("");
    setSelectedChildCategory("");
    setAvailableSubCategories([]);
    setAvailableChildCategories([]);
    
    // Reset images
    setImages([]);
    setPrimaryImage(null);
    setImagePreviewUrls([]);
    setPrimaryImagePreview("");
    
    // Reset validation state
    setErrors({});
    setFormSubmitted(false);
    
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { categoryAdmin, fetchGetAllCategoryForAdmin } = useCategory();

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedChildCategory, setSelectedChildCategory] = useState<string>("");

  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>([]);
  const [availableChildCategories, setAvailableChildCategories] = useState<any[]>([]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchGetAllCategoryForAdmin();
  }, []);

  // Update sub-categories when main category changes
  useEffect(() => {
    if (selectedMainCategory && categoryAdmin) {
      const mainCat = categoryAdmin.find((cat: any) => cat.main_category_id === selectedMainCategory);
      if (mainCat) {
        setAvailableSubCategories(mainCat.sub_category || []);
        setSelectedSubCategory("");
        setSelectedChildCategory("");
        setAvailableChildCategories([]);

        // Update category state with main category info
        setCategory({
          ...category,
          main_category_id: mainCat.main_category_id,
          main_category_name: mainCat.main_category_name,
          main_category_slug: mainCat.main_category_slug,
          child_category_id: "",
          child_category_name: "",
          child_category_slug: "",
          sub_category_id: "",
          sub_category_name: "",
          sub_category_slug: ""
        });
      }
    }
  }, [selectedMainCategory, categoryAdmin]);

  // Update child-categories when sub-category changes
  useEffect(() => {
    if (selectedSubCategory && availableSubCategories.length > 0) {
      const subCat = availableSubCategories.find((cat: any) => cat.sub_category_id === selectedSubCategory);
      if (subCat) {
        setAvailableChildCategories(subCat.child_category || []);
        setSelectedChildCategory("");

        // Update category state with sub-category info
        setCategory({
          ...category,
          sub_category_id: subCat.sub_category_id,
          sub_category_name: subCat.sub_category_name,
          sub_category_slug: subCat.sub_category_slug,
          child_category_id: "",
          child_category_name: "",
          child_category_slug: ""
        });
      }
    }
  }, [selectedSubCategory, availableSubCategories]);

  // Update category state when child category changes
  useEffect(() => {
    if (selectedChildCategory && availableChildCategories.length > 0) {
      const childCat = availableChildCategories.find((cat: any) => cat.child_category_id === selectedChildCategory);
      if (childCat) {
        // Update category state with child-category info
        setCategory({
          ...category,
          child_category_id: childCat.child_category_id,
          child_category_name: childCat.child_category_name,
          child_category_slug: childCat.child_category_slug
        });
      }
    }
  }, [selectedChildCategory, availableChildCategories]);

  // Helper components for displaying errors
  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-500 text-xs mt-1">{message}</p>
  );

  // Function to determine if a field has an error
  const hasError = (fieldName: string): boolean => {
    return formSubmitted && !!errors[fieldName];
  };

  return (
    <div className="">
      <h2 className="text-2xl font-extrabold text-black">Create Product</h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-[#1E4DB7]">
          Home
        </Link>
        <span> / </span>
        <Link href="/create-single-product" className="text-gray-800">
          Create Product
        </Link>
      </div>
      <form onSubmit={submitProduct}>
        <div className="flex gap-4 h-full">
          <div className="w-2/3 flex flex-col space-y-5">
            <div className="bg-white shadow-sm rounded-2xl p-5 flex flex-col h-full">
              {/* <General /> */}

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div data-error={hasError('product_name')}>
                    <label className="block text-sm font-medium mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className={`border rounded-lg p-2 w-full ${hasError('product_name') ? 'border-red-500' : ''}`}
                    />
                    {hasError('product_name') && <ErrorMessage message={errors.product_name} />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Primary Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name_primary"
                      className={`border rounded-lg p-2 w-full ${hasError('name_primary') ? 'border-red-500' : ''}`}
                    />
                    {hasError('name_primary') && <ErrorMessage message={errors.name_primary} />}
                  </div>
                  <div data-error={hasError('slug')}>
                    <label className="block text-sm font-medium mb-1">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className={`border rounded-lg p-2 w-full ${hasError('slug') ? 'border-red-500' : ''}`}
                    />
                    {hasError('slug') && <ErrorMessage message={errors.slug} />}
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically generated from product name. You can edit if needed.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Origin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="origin"
                      className={`border rounded-lg p-2 w-full ${hasError('origin') ? 'border-red-500' : ''}`}
                    />
                    {hasError('origin') && <ErrorMessage message={errors.origin} />}
                  </div>
                </div>
                <div className="mt-3" data-error={hasError('description')}>
                  <label className="block text-sm font-medium mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    className={`border rounded-lg p-2 w-full ${hasError('description') ? 'border-red-500' : ''}`}
                  ></textarea>
                  {hasError('description') && <ErrorMessage message={errors.description} />}
                </div>
              </div>

              {/* Category Information */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Category Information</h3>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div data-error={hasError('main_category')}>
                    <label className="block text-sm font-medium mb-1">
                      Main Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`border rounded-lg p-2 w-full ${hasError('main_category') ? 'border-red-500' : ''}`}
                      value={selectedMainCategory}
                      onChange={(e) => setSelectedMainCategory(e.target.value)}
                    >
                      <option value="">Select Main Category</option>
                      {categoryAdmin && categoryAdmin.map((mainCat: any) => (
                        <option key={mainCat.main_category_id} value={mainCat.main_category_id}>
                          {mainCat.main_category_name}
                        </option>
                      ))}
                    </select>
                    {hasError('main_category') && <ErrorMessage message={errors.main_category} />}
                  </div>

                  {selectedMainCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Sub Category</label>
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                      >
                        <option value="">Select Sub Category</option>
                        {availableSubCategories.map((subCat: any) => (
                          <option key={subCat.sub_category_id} value={subCat.sub_category_id}>
                            {subCat.sub_category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedSubCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Child Category</label>
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={selectedChildCategory}
                        onChange={(e) => setSelectedChildCategory(e.target.value)}
                      >
                        <option value="">Select Child Category</option>
                        {availableChildCategories.map((childCat: any) => (
                          <option key={childCat.child_category_id} value={childCat.child_category_id}>
                            {childCat.child_category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-medium mb-2">Selected Category:</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Main:</span> {category.main_category_name || "None"}
                    </div>
                    <div>
                      <span className="font-medium">Sub:</span> {category.sub_category_name || "None"}
                    </div>
                    <div>
                      <span className="font-medium">Child:</span> {category.child_category_name || "None"}
                    </div>
                  </div>
                </div>

                {/* Hidden inputs to store the category data - these will be handled by the JSON serialization in the submit handler */}
                <input type="hidden" name="main_category_id" value={category.main_category_id} />
                <input type="hidden" name="main_category_name" value={category.main_category_name} />
                <input type="hidden" name="main_category_slug" value={category.main_category_slug} />
                <input type="hidden" name="sub_category_id" value={category.sub_category_id} />
                <input type="hidden" name="sub_category_name" value={category.sub_category_name} />
                <input type="hidden" name="sub_category_slug" value={category.sub_category_slug} />
                <input type="hidden" name="child_category_id" value={category.child_category_id} />
                <input type="hidden" name="child_category_name" value={category.child_category_name} />
                <input type="hidden" name="child_category_slug" value={category.child_category_slug} />
              </div>
            </div>

            {/* Prices Section */}
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">
                Prices & Units <span className="text-red-500">*</span>
              </h3>
              {hasError('prices') && <ErrorMessage message={errors.prices} />}

              {prices.map((price, index) => (
                <div key={index} className="mb-4 p-3 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Price Option {index + 1}</h4>
                    {prices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePriceItem(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Original Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={price.original_price}
                        onChange={(e) => updatePriceItem(index, 'original_price', Number(e.target.value))}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit Price</label>
                      <input
                        type="text"
                        value={price.unit_price}
                        onChange={(e) => updatePriceItem(index, 'unit_price', e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount</label>
                      <input
                        type="number"
                        value={price.discount}
                        onChange={(e) => updatePriceItem(index, 'discount', Number(e.target.value))}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={price.unit}
                        onChange={(e) => updatePriceItem(index, 'unit', e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      >
                        <option value="">Select a unit</option>
                        {unitOptions.map((unit, idx) => (
                          <option key={idx} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <input
                        type="number"
                        value={price.amount}
                        onChange={(e) => updatePriceItem(index, 'amount', Number(e.target.value))}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount Per Unit</label>
                      <input
                        type="text"
                        value={price.amount_per_unit}
                        onChange={(e) => updatePriceItem(index, 'amount_per_unit', e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPriceItem}
                className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Add New Price Option
              </button>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">
                Ingredients <span className="text-red-500">*</span>
              </h3>
              {hasError('ingredients') && <ErrorMessage message={errors.ingredients} />}

              {ingredients.map((ingredient, index) => (
                <div key={index} className="mb-3 p-3 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Ingredient {index + 1}</h4>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientItem(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ingredient Name</label>
                      <input
                        type="text"
                        value={ingredient.ingredient_name}
                        onChange={(e) => updateIngredientItem(index, 'ingredient_name', e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Ingredient Amount</label>
                      <input
                        type="text"
                        value={ingredient.ingredient_amount}
                        onChange={(e) => updateIngredientItem(index, 'ingredient_amount', e.target.value)}
                        className="border rounded-lg p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredientItem}
                className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Add New Ingredient
              </button>
            </div>

            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Manufacturer</h3>
              <div className="grid grid-cols-2 gap-4">
                <div data-error={hasError('manufacture_name')}>
                  <label className="block text-sm font-medium mb-1">
                    Manufacturer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manufacturer.manufacture_name}
                    onChange={(e) => setManufacturer({ ...manufacturer, manufacture_name: e.target.value })}
                    className={`border rounded-lg p-2 w-full ${hasError('manufacture_name') ? 'border-red-500' : ''}`}
                  />
                  {hasError('manufacture_name') && <ErrorMessage message={errors.manufacture_name} />}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manufacturer Contact</label>
                  <input
                    type="text"
                    value={manufacturer.manufacture_contact}
                    onChange={(e) => setManufacturer({ ...manufacturer, manufacture_contact: e.target.value })}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Manufacturer Address</label>
                  <input
                    type="text"
                    value={manufacturer.manufacture_address}
                    onChange={(e) => setManufacturer({ ...manufacturer, manufacture_address: e.target.value })}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 flex flex-col space-y-5">
            {/* Additional Product Details */}
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="space-y-4">
                <div data-error={hasError('uses')}>
                  <label className="block text-sm font-medium mb-1">
                    Uses <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="uses"
                    rows={3}
                    className={`border rounded-lg p-2 w-full ${hasError('uses') ? 'border-red-500' : ''}`}
                  ></textarea>
                  {hasError('uses') && <ErrorMessage message={errors.uses} />}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dosage</label>
                  <textarea name="dosage" rows={3} className="border rounded-lg p-2 w-full"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dosage Form</label>
                  <input type="text" name="dosage_form" className="border rounded-lg p-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Side Effects</label>
                  <textarea name="side_effects" rows={3} className="border rounded-lg p-2 w-full"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precautions</label>
                  <textarea name="precautions" rows={3} className="border rounded-lg p-2 w-full"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Storage Instructions</label>
                  <textarea name="storage" rows={3} className="border rounded-lg p-2 w-full"></textarea>
                </div>
                {/* Enhanced Product Images Section */}
                <div data-error={hasError('images')}>
                  <label className="block text-sm font-medium mb-1">
                    Product Images <span className="text-red-500">*</span> <span className="text-blue-500">(Multiple images allowed)</span>
                  </label>

                  <div
                    className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : hasError('images') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="text-center py-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>

                      <div className="flex flex-col items-center text-sm text-gray-600">
                        <p className="font-medium">Drag and drop images here, or</p>
                        <label className="mt-2 cursor-pointer text-blue-600 hover:text-blue-800">
                          <span>Click to select files</span>
                          <input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>

                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>
                  {hasError('images') && <ErrorMessage message={errors.images} />}
                  {imagePreviewUrls.length > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">
                          {images.length} image{images.length !== 1 ? 's' : ''} selected
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setImages([]);
                            setImagePreviewUrls([]);
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              className="h-20 w-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Image */}
                <div data-error={hasError('images_primary')}>
                  <label className="block text-sm font-medium mb-1">
                    Primary Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="images_primary"
                    onChange={handlePrimaryImageChange}
                    className={`border rounded-lg p-2 w-full ${hasError('images_primary') ? 'border-red-500' : ''}`}
                    accept="image/*"
                  />
                  {hasError('images_primary') && <ErrorMessage message={errors.images_primary} />}
                  {primaryImagePreview && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={primaryImagePreview}
                        alt="Primary image preview"
                        className="h-24 w-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={removePrimaryImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            type="submit"
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-3 px-5 rounded-xl hover:bg-[#002E99]"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="text-sm text-red-500 font-semibold py-3 px-5 rounded-xl border border-red-500 hover:bg-red-500 hover:text-white"
          >
            Cancel
          </button>
        </div>

        {formSubmitted && Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium text-sm">Please fix the following errors:</p>
            <ul className="list-disc pl-5 mt-1 text-xs text-red-500">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateSingleProduct;
