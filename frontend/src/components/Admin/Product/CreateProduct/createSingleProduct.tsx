"use client";
import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { useCategory } from "@/hooks/useCategory";
import { useToast } from "@/providers/toastProvider";
import { TbFileTypePdf } from "react-icons/tb";
import { BiSolidImageAdd } from "react-icons/bi";
import "react-quill/dist/quill.snow.css"; // Import styles
import ReactQuill from "react-quill"; // Import ReactQuill
import "@/styles/globals.css";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { send } from "process";

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, false] }],
  [{ font: [] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["link", "image", "video"],
  ["clean"], // remove formatting button
];

const CreateSingleProduct = () => {
  const unitOptions: string[] = ["Gói", "Hộp", "Viên", "Vỉ", "Chai", "Tuýp"];
  const router = useRouter();
  const {
    addProduct,
    fetchUpdateProduct,
    getAllProductsAdmin,
    allProductAdmin,
    fetchUpdateCertificateFileProduct,
    fetchUpdateImagesPrimaryProduct,
    fetchUpdateImagesProduct,
  } = useProduct();

  interface PriceItem {
    original_price: number;
    discount: number;
    unit: string;
    amount: number;
    weight: number;
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
    {
      original_price: 0,
      discount: 0,
      unit: "",
      amount: 0,
      weight: 0,
    },
  ]);

  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { ingredient_name: "", ingredient_amount: "" },
  ]);

  const [manufacturer, setManufacturer] = useState<Manufacturer>({
    manufacture_name: "",
    manufacture_address: "",
    manufacture_contact: "",
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
    sub_category_id: "",
  });

  const [productName, setProductName] = useState<string>("");
  // const [product_id, setProductId] = useState<string>("");

  const [is_approved, setIsApproved] = useState<boolean>(false);

  const [namePrimary, setNamePrimary] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [inventory, setInventory] = useState<number>(0);
  const [brand, setBrand] = useState<string>("");
  const [uses, setUses] = useState<string>("");
  const [dosageForm, setDosageForm] = useState<string>("");
  const [registration_number, setRegistrationNumber] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [full_descriptions, setFullDescription] = useState<string>("");
  const [side_effects, setSideEffects] = useState<string>("");
  const [precautions, setPrecautions] = useState<string>("");
  const [storage, setStorage] = useState<string>("");
  const [prescriptionRequired, setPrescriptionRequired] =
    useState<boolean>(false);

  const [slug, setSlug] = useState<string>("");
  const [rejected_note, setRejectedNote] = useState<string>("");
  const toast = useToast();

  // Add state for managing images
  const [images, setImages] = useState<File[]>([]);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string>("");
  const primaryImageInputRef = useRef<HTMLInputElement | null>(null);

  const [certificate_file, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string>("");
  const certificateInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCertificateChanged, setHasCertificateChanged] = useState(false);
  const [hasPrimaryImageChanged, setHasPrimaryImageChanged] = useState(false);
  const [hasImagesChanged, setHasImagesChanged] = useState(false);

  const { categoryAdmin, fetchGetAllCategoryForAdmin } = useCategory();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedChildCategory, setSelectedChildCategory] =
    useState<string>("");

  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>(
    []
  );
  const [availableChildCategories, setAvailableChildCategories] = useState<
    any[]
  >([]);

  // Add state for validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const parsedCategoryRef = useRef<any>(null);
  const detailId = searchParams.get("chi-tiet");
  const isViewOnly = !!detailId;
  const productId = editId || detailId;

  // console.log("productId", editId);
  // const detailId = query["chi-tiet"];

  // Function to generate a slug from product name with Vietnamese character support
  const generateSlug = (title: string): string => {
    let slug = title.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
    slug = slug.replace(/đ/gi, "d");
    //Xóa các ký tự đặt biệt
    slug = slug.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ""
    );
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-\-/gi, "-");
    slug = slug.replace(/\-\-\-/gi, "-");
    slug = slug.replace(/\-\-/gi, "-");
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = "@" + slug + "@";
    slug = slug.replace(/\@\-|\-\@|\@/gi, "");
    return slug;
  };

  useEffect(() => {
    if (productName) {
      setSlug(generateSlug(productName));
    }
  }, [productName]);

  const addPriceItem = () => {
    setPrices([
      ...prices,
      {
        original_price: 0,
        discount: 0,
        unit: "",
        amount: 0,
        weight: 0,
      },
    ]);
  };

  const removePriceItem = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const updatePriceItem = (
    index: number,
    field: keyof PriceItem,
    value: string | number
  ) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = { ...updatedPrices[index], [field]: value };
    setPrices(updatedPrices);
  };

  const addIngredientItem = () => {
    setIngredients([
      ...ingredients,
      { ingredient_name: "", ingredient_amount: "" },
    ]);
  };

  const removeIngredientItem = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredientItem = (
    index: number,
    field: keyof IngredientItem,
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };

  // Enhanced image handlers
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Add new files to existing images
      const fileArray = Array.from(e.target.files);
      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages);
      setHasImagesChanged(true);

      // Generate preview URLs for new files
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreviewUrls((prev) => [...prev, reader.result as string]);
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
      const fileArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.includes("image")
      );

      const updatedImages = [...images, ...fileArray];
      setImages(updatedImages);

      // Generate preview URLs
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreviewUrls((prev) => [...prev, reader.result as string]);
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
      setHasPrimaryImageChanged(true);

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
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
    if (!productName) newErrors.product_name = "Vui lòng điền tên sản phẩm";
    if (!slug) newErrors.slug = "Vui lòng điền Slug";

    // Validate category selection
    if (!category.main_category_id)
      newErrors.main_category = "Vui lòng chọn một danh mục chính";

    // Validate prices
    if (prices.length === 0) {
      newErrors.prices = "Cần có ít nhất một tùy chọn giá";
    } else {
      const priceErrors: string[] = [];
      prices.forEach((price, index) => {
        if (!price.unit)
          priceErrors.push(`Tùy chọn ${index + 1}: Vui lòng điền đơn vị`);
        if (price.original_price <= 0)
          priceErrors.push(`Tùy chọn ${index + 1}: Giá gốc phải lớn hơn 0`);
      });
      if (priceErrors.length > 0) {
        newErrors.prices = priceErrors.join(";");
      }
    }

    // Validate ingredients
    const ingredientErrors: string[] = [];
    ingredients.forEach((ingredient, index) => {
      if (!ingredient.ingredient_name)
        ingredientErrors.push(
          `Thành phần ${index + 1}: Vui lòng điền tên thành phần`
        );
    });
    if (ingredientErrors.length > 0) {
      newErrors.ingredients = ingredientErrors.join("; ");
    }

    // Validate manufacturer
    if (!manufacturer.manufacture_name)
      newErrors.manufacture_name = "Vui lòng điền tên nhà sản xuất";

    // Validate product details
    if (
      !document.querySelector<HTMLTextAreaElement>(
        'textarea[name="description"]'
      )?.value
    )
      newErrors.description = "Vui lòng điền mô tả ngắn";
    if (!uses || uses.trim() === "" || uses === "<p><br></p>") {
      newErrors.uses = "Vui lòng điền thông tin công dụng";
    }

    if (
      !document.querySelector<HTMLInputElement>('input[name="inventory"]')
        ?.value
    )
      newErrors.inventory = "Vui lòng điền số lượng sản phẩm";

    if (!document.querySelector<HTMLInputElement>('input[name="brand"]')?.value)
      newErrors.brand = "Vui lòng điền thương hiệu sản phẩm";
    // Validate images
    if (images.length === 0)
      newErrors.images = "Vui lòng tải lên ít nhất một hình ảnh sản phẩm";
    if (!primaryImage)
      newErrors.images_primary = "Vui lòng tải lên hình ảnh sản phẩm chính";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => {
    if (primaryImageInputRef.current) {
      primaryImageInputRef.current.value = "";
    }
    setProductName("");
    setSlug("");
    setPrices([
      {
        original_price: 0,
        discount: 0,
        unit: "",
        amount: 0,
        weight: 0,
      },
    ]);
    setIngredients([{ ingredient_name: "", ingredient_amount: "" }]);
    setManufacturer({
      manufacture_name: "",
      manufacture_address: "",
      manufacture_contact: "",
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
      sub_category_id: "",
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
    setCertificateFile(null);
    setCertificatePreview("");

    setNamePrimary("");
    setOrigin("");
    setDescription("");
    setInventory(0);
    setBrand("");
    setUses("");
    setDosageForm("");
    setDosage("");
    setSideEffects("");
    setPrecautions("");
    setStorage("");
    setFullDescription("");
    setPrescriptionRequired;

    // Reset validation state
    setErrors({});
    setFormSubmitted(false);
  };
  useEffect(() => {
    if (selectedSubCategory && availableSubCategories.length > 0) {
      const subCat = availableSubCategories.find(
        (cat: any) => cat.sub_category_id === selectedSubCategory
      );
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
          child_category_slug: "",
        });
      }
    }
  }, [selectedSubCategory, availableSubCategories]);
  useEffect(() => {
    if (selectedMainCategory && categoryAdmin) {
      const mainCat = categoryAdmin.find(
        (cat: any) => cat.main_category_id === selectedMainCategory
      );
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
          sub_category_slug: "",
        });
      }
    }
  }, [selectedMainCategory, categoryAdmin]);

  // Update category state when child category changes
  useEffect(() => {
    if (selectedChildCategory && availableChildCategories.length > 0) {
      const childCat = availableChildCategories.find(
        (cat: any) => cat.child_category_id === selectedChildCategory
      );
      if (childCat) {
        // Update category state with child-category info
        setCategory({
          ...category,
          child_category_id: childCat.child_category_id,
          child_category_name: childCat.child_category_name,
          child_category_slug: childCat.child_category_slug,
        });
      }
    }
  }, [selectedChildCategory, availableChildCategories]);

  useEffect(() => {
    if (!productId) return;
    getAllProductsAdmin();
  }, [productId]);

  useEffect(() => {
    if (
      !productId ||
      !allProductAdmin ||
      allProductAdmin.length === 0 ||
      !categoryAdmin
    )
      return;

    const product = allProductAdmin.find(
      (item: any) => item.product_id === productId
    );
    if (!product) {
      toast.showToast("Không tìm thấy sản phẩm", "error");
      return;
    }

    // Set state cơ bản

    setProductName(product.product_name);
    setSlug(product.slug);
    setNamePrimary(product.name_primary);
    setIsApproved(product.is_approved);
    setRejectedNote(product.rejected_note);
    setOrigin(product.origin);
    setDescription(product.description);
    setInventory(product.inventory);
    setBrand(product.brand);
    setUses(product.uses);
    setDosageForm(product.dosage_form);
    setRegistrationNumber(product.registration_number);
    setDosage(product.dosage);
    setSideEffects(product.side_effects);
    setPrecautions(product.precautions);
    setStorage(product.storage);
    setFullDescription(product.full_descriptions);
    setPrescriptionRequired(product.prescription_required);
    setPrices(
      product.prices.map((p: any) => ({
        original_price: p.original_price,
        discount: p.discount,
        unit: p.unit,
        amount: p.amount,
        weight: p.weight,
      }))
    );
    setIngredients(
      product.ingredients.map((i: any) => ({
        ingredient_name: i.ingredient_name,
        ingredient_amount: i.ingredient_amount,
      }))
    );
    setManufacturer({
      manufacture_name: product.manufacturer.manufacture_name,
      manufacture_address: product.manufacturer.manufacture_address,
      manufacture_contact: product.manufacturer.manufacture_contact,
    });
    setImages(product.images.map((img: any) => img.images_url)); // Set images
    setPrimaryImage(product.images_primary); // Set primary image

    if (product.images && product.images.length > 0) {
      const imageUrls = product.images.map((img: any) => img.images_url);
      setImagePreviewUrls(imageUrls); // Cập nhật URL ảnh
    }
    setPrimaryImagePreview(product.images_primary);
    setSelectedMainCategory(product.category.main_category_id);
    setSelectedSubCategory(product.category.sub_category_id);
    setSelectedChildCategory(product.category.child_category_id);
    setCertificateFile(product.certificate_file);
  }, [allProductAdmin, editId, categoryAdmin]);

  const submitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    const isValid = validateForm();
    if (!isValid) {
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.delete("images");
    formData.delete("images_primary");
    images.forEach((image) => {
      formData.append("images", image);
    });
    if (primaryImage) {
      formData.append("images_primary", primaryImage);
    }
    if (certificate_file) {
      formData.append("certificate_file", certificate_file);
    }
    formData.set("ingredients", JSON.stringify({ ingredients }));
    formData.set("prices", JSON.stringify({ prices }));
    formData.set("manufacturer", JSON.stringify(manufacturer));
    formData.set("category", JSON.stringify(category));
    formData.set("uses", uses);
    formData.set("dosage_form", dosageForm);
    formData.set("registration_number", registration_number);
    formData.set("dosage", dosage);
    formData.set("side_effects", side_effects);
    formData.set("precautions", precautions);
    formData.set("storage", storage);
    formData.set("full_descriptions", full_descriptions);
    formData.set("prescription_required", JSON.stringify(prescriptionRequired));

    // nếu is_approve là false thì hiện là Từ chối, nếu true thì Duyệt

    const dataToSend = {
      product_id: editId,
      product_name: productName,
      is_approved: is_approved,
      slug,
      name_primary: namePrimary,
      origin,
      description,
      inventory,
      brand,
      uses,
      dosage_form: dosageForm,
      registration_number,
      dosage,
      side_effects,
      precautions,
      storage,
      full_descriptions,
      prescription_required: prescriptionRequired,
      prices: {
        prices: prices.map((p) => ({
          original_price: p.original_price,
          discount: p.discount,
          unit: p.unit,
          amount: p.amount,
          weight: p.weight,
        })),
      },

      ingredients: {
        ingredients: ingredients.map((i) => ({
          ingredient_name: i.ingredient_name,
          ingredient_amount: i.ingredient_amount,
        })),
      },

      manufacturer,
      category: {
        main_category_id: selectedMainCategory,
        sub_category_id: selectedSubCategory,
        child_category_id: selectedChildCategory,
      },
      images: imagePreviewUrls,
      images_primary: primaryImagePreview,
    };

    // Chuyển URL (string) thành File
    const urlToFile = async (
      url: string,
      filename: string,
      mimeType: string
    ): Promise<File> => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: mimeType });
    };

    const prepareImages = async () => {
      const formData_Images = new FormData();

      for (const image of images) {
        if (typeof image === "string") {
          // Xử lý ảnh cũ dạng URL
          const file = await urlToFile(image, "old_image.jpg", "image/jpeg"); // tùy MIME
          formData_Images.append("files", file);
        } else {
          // Ảnh mới đã là File
          formData_Images.append("files", image);
        }
      }

      return formData_Images;
    };

    // console.log("formData_Certificate", formData_Certificate);
    // console.log("formData_Images", formData_Images);
    // console.log("formData_PrimaryImage", formData_PrimaryImage);
    if (editId) {
      try {
        if (hasCertificateChanged) {
          const formData_Certificate = new FormData(e.currentTarget);
          if (certificate_file) {
            formData_Certificate.append("file", certificate_file);
          }
          await fetchUpdateCertificateFileProduct(
            { product_id: editId, file: formData_Certificate },
            (msg) => toast.showToast(msg, "success"),
            (msg) => Promise.reject(new Error(msg))
          );
        }

        if (hasPrimaryImageChanged) {
          const formData_PrimaryImage = new FormData();
          if (primaryImage) {
            formData_PrimaryImage.append("file", primaryImage);
          }
          await fetchUpdateImagesPrimaryProduct(
            { product_id: editId, file: formData_PrimaryImage },
            (msg) => toast.showToast(msg, "success"),
            (msg) => Promise.reject(new Error(msg))
          );
        }

        if (hasImagesChanged) {
          const formData_Images = await prepareImages();
          await fetchUpdateImagesProduct(
            { product_id: editId, files: formData_Images },
            (msg) => toast.showToast(msg, "success"),
            (msg) => Promise.reject(new Error(msg))
          );
        }

        if (Object.keys(dataToSend).length > 0) {
          await fetchUpdateProduct(
            dataToSend,
            (msg) => toast.showToast(msg, "success"),
            (msg) => Promise.reject(new Error(msg))
          );
        }

        // toast.showToast("Cập nhật hoàn tất!", "success");
      } catch (error: any) {
        toast.showToast("Lỗi khi cập nhật: " + error.message, "error");
      }
    } else {
      await addProduct(
        formData,
        (message: any) => {
          toast.showToast(message, "success");
          resetForm();
        },
        (message: any) => {
          toast.showToast(message, "error");
        }
      );
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
  };

  useEffect(() => {
    fetchGetAllCategoryForAdmin();
  }, []);

  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-500 text-xs mt-1">{message}</p>
  );

  const hasError = (fieldName: string): boolean => {
    return formSubmitted && !!errors[fieldName];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setCertificateFile(selectedFile);
      setHasCertificateChanged(true);
    } else {
      alert("Vui lòng chọn tệp PDF");
    }
  };

  const removeFile = () => {
    setCertificateFile(null);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-extrabold text-black">
        <h1>
          {editId
            ? "Chỉnh sửa sản phẩm"
            : detailId
            ? "Xem chi tiết sản phẩm"
            : "Thêm sản phẩm"}
        </h1>
      </h2>
      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/create-single-product" className="text-gray-800">
          {editId
            ? "Chỉnh sửa sản phẩm"
            : detailId
            ? "Xem chi tiết sản phẩm"
            : "Thêm sản phẩm"}
        </Link>
      </div>
      <form onSubmit={submitProduct}>
        <div className="flex gap-4 h-full">
          <div className="w-2/3 flex flex-col space-y-5">
            <div className="bg-white shadow-sm rounded-2xl p-5 flex flex-col h-full">
              {/* <General /> */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div data-error={hasError("product_id")}>
                    <label className="block text-sm font-medium mb-1">
                      ID sản phẩm
                    </label>
                    <input
                      type="text"
                      name="product_id"
                      value={detailId || ""}
                      onChange={(e) => setProductName(e.target.value)}
                      className={`border rounded-lg p-2 w-full ${
                        hasError("product_id") ? "border-red-500" : ""
                      }`}
                      disabled={isViewOnly}
                    />
                    {hasError("product_id") && (
                      <ErrorMessage message={errors.product_id} />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Trạng thái
                    </label>
                    <input
                      type="text"
                      name="is_approved"
                      className={`border rounded-lg p-2 w-full font-semibold
    ${hasError("is_approved") ? "border-red-500" : ""}
    ${is_approved ? "text-green-600" : "text-red-600"}
  `}
                      value={is_approved ? "Duyệt" : "TỪ CHỐI"}
                      disabled={isViewOnly}
                    />
                    {hasError("is_approved") && (
                      <ErrorMessage message={errors.is_approved} />
                    )}
                  </div>
                </div>
                {detailId && is_approved === false && (
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1 w-full">
                      Lý do từ chối:
                    </label>
                    <textarea
                      rows={4}
                      name="note"
                      value={rejected_note}
                      // onChange={(e) => setSlug(e.target.value)}
                      className={`border rounded-lg p-2 w-full ${
                        hasError("slug") ? "border-red-500" : ""
                      }`}
                      disabled={isViewOnly}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div data-error={hasError("product_name")}>
                    <label className="block text-sm font-medium mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className={`border rounded-lg p-2 w-full ${
                        hasError("product_name") ? "border-red-500" : ""
                      }`}
                      disabled={isViewOnly}
                    />
                    {hasError("product_name") && (
                      <ErrorMessage message={errors.product_name} />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tên sản phẩm chính <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name_primary"
                      className={`border rounded-lg p-2 w-full ${
                        hasError("name_primary") ? "border-red-500" : ""
                      }`}
                      value={namePrimary}
                      onChange={(e) => setNamePrimary(e.target.value)}
                      disabled={isViewOnly}
                    />
                    {hasError("name_primary") && (
                      <ErrorMessage message={errors.name_primary} />
                    )}
                  </div>
                  <div data-error={hasError("slug")}>
                    <label className="block text-sm font-medium mb-1">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className={`border rounded-lg p-2 w-full ${
                        hasError("slug") ? "border-red-500" : ""
                      }`}
                      disabled={isViewOnly}
                    />
                    {hasError("slug") && <ErrorMessage message={errors.slug} />}
                    <p className="text-xs text-gray-500 mt-1">
                      Tự động tạo từ tên sản phẩm. Bạn có thể chỉnh sửa nếu cần.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nguồn gốc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="origin"
                      className={`border rounded-lg p-2 w-full ${
                        hasError("origin") ? "border-red-500" : ""
                      }`}
                      onChange={(e) => setOrigin(e.target.value)}
                      value={origin}
                      disabled={isViewOnly}
                    />
                    {hasError("origin") && (
                      <ErrorMessage message={errors.origin} />
                    )}
                  </div>
                </div>
                <div className="flex grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="prescription_required"
                      name="prescription_required"
                      checked={prescriptionRequired}
                      onChange={(e) =>
                        setPrescriptionRequired(e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
                      disabled={isViewOnly}
                    />
                    <label htmlFor="prescription_required" className="text-sm">
                      Thuốc kê toa
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số đăng ký <span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      className="border rounded-lg p-2 w-full"
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      value={registration_number}
                      disabled={isViewOnly}
                    />
                    {hasError("origin") && (
                      <ErrorMessage message={errors.origin} />
                    )}
                  </div>
                </div>
                <div className="mt-3" data-error={hasError("description")}>
                  <label className="block text-sm font-medium mb-1">
                    Mô tả ngắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className={`border rounded-lg p-2 w-full ${
                      hasError("description") ? "border-red-500" : ""
                    }`}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    disabled={isViewOnly}
                  ></textarea>
                  {hasError("description") && (
                    <ErrorMessage message={errors.description} />
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="block text-sm font-medium mb-1">
                    Mô tả đầy đủ
                  </h3>
                  <ReactQuill
                    name="full_descriptions"
                    onChange={(value: any) => setFullDescription(value)}
                    value={full_descriptions}
                    modules={{ toolbar: toolbarOptions }}
                    readOnly={isViewOnly}
                  />
                </div>
              </div>

              {/* Category Information */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">
                  Thông tin danh mục
                </h3>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div data-error={hasError("main_category")}>
                    <label className="block text-sm font-medium mb-1">
                      Danh mục chính <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`border rounded-lg p-2 w-full ${
                        hasError("main_category") ? "border-red-500" : ""
                      }`}
                      value={selectedMainCategory}
                      onChange={(e) => setSelectedMainCategory(e.target.value)}
                      disabled={isViewOnly}
                    >
                      <option value="">Chọn danh mục chính</option>
                      {categoryAdmin &&
                        categoryAdmin.map((mainCat: any) => (
                          <option
                            key={mainCat.main_category_id}
                            value={mainCat.main_category_id}
                          >
                            {mainCat.main_category_name}
                          </option>
                        ))}
                    </select>
                    {hasError("main_category") && (
                      <ErrorMessage message={errors.main_category} />
                    )}
                  </div>

                  {selectedMainCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Danh mục cấp 1
                      </label>
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        disabled={isViewOnly}
                      >
                        <option value="">Chọn danh mục cấp 1</option>
                        {availableSubCategories.map((subCat: any) => (
                          <option
                            key={subCat.sub_category_id}
                            value={subCat.sub_category_id}
                          >
                            {subCat.sub_category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedSubCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Danh mục cấp 2
                      </label>
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={selectedChildCategory}
                        onChange={(e) =>
                          setSelectedChildCategory(e.target.value)
                        }
                        disabled={isViewOnly}
                      >
                        <option value="">Chọn danh mục cấp 2</option>
                        {availableChildCategories.map((childCat: any) => (
                          <option
                            key={childCat.child_category_id}
                            value={childCat.child_category_id}
                          >
                            {childCat.child_category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-sm font-medium mb-2">Danh mục đã chọn</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Chính:</span>{" "}
                      {category.main_category_name || "Chưa có"}
                    </div>
                    <div>
                      <span className="font-medium">Cấp 1:</span>{" "}
                      {category.sub_category_name || "Chưa có"}
                    </div>
                    <div>
                      <span className="font-medium">Cấp 2:</span>{" "}
                      {category.child_category_name || "Chưa có"}
                    </div>
                  </div>
                </div>

                {/* Hidden inputs to store the category data - these will be handled by the JSON serialization in the submit handler */}
                <input
                  type="hidden"
                  name="main_category_id"
                  value={category.main_category_id}
                />
                <input
                  type="hidden"
                  name="main_category_name"
                  value={category.main_category_name}
                />
                <input
                  type="hidden"
                  name="main_category_slug"
                  value={category.main_category_slug}
                />
                <input
                  type="hidden"
                  name="sub_category_id"
                  value={category.sub_category_id}
                />
                <input
                  type="hidden"
                  name="sub_category_name"
                  value={category.sub_category_name}
                />
                <input
                  type="hidden"
                  name="sub_category_slug"
                  value={category.sub_category_slug}
                />
                <input
                  type="hidden"
                  name="child_category_id"
                  value={category.child_category_id}
                />
                <input
                  type="hidden"
                  name="child_category_name"
                  value={category.child_category_name}
                />
                <input
                  type="hidden"
                  name="child_category_slug"
                  value={category.child_category_slug}
                />
              </div>
            </div>

            {/* Prices Section */}
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Chi tiết sản phẩm</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Dạng bào chế
                </label>
                <input
                  type="text"
                  name="dosage_form"
                  className="border rounded-lg p-2 w-full"
                  onChange={(e) => setDosageForm(e.target.value)}
                  value={dosageForm}
                  disabled={isViewOnly}
                />
              </div>
              <div data-error={hasError("uses")} className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Công dụng <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  name="uses"
                  onChange={(value: any) => setUses(value)}
                  value={uses}
                  modules={{ toolbar: toolbarOptions }}
                  readOnly={isViewOnly}
                />
                {hasError("uses") && <ErrorMessage message={errors.uses} />}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Liều lượng
                </label>
                <ReactQuill
                  name="dosage"
                  onChange={(value: any) => setDosage(value)}
                  value={dosage}
                  modules={{ toolbar: toolbarOptions }}
                  readOnly={isViewOnly}
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Tác dụng phụ
                </label>
                <ReactQuill
                  name="side_effects"
                  onChange={(value: any) => setSideEffects(value)}
                  value={side_effects}
                  modules={{ toolbar: toolbarOptions }}
                  readOnly={isViewOnly}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Lưu ý</label>
                <ReactQuill
                  name="precautions"
                  onChange={(value: any) => setPrecautions(value)}
                  value={precautions}
                  modules={{ toolbar: toolbarOptions }}
                  readOnly={isViewOnly}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Hướng dẫn bảo quản
                </label>
                <ReactQuill
                  name="storage"
                  onChange={(value: any) => setStorage(value)}
                  value={storage}
                  modules={{ toolbar: toolbarOptions }}
                  readOnly={isViewOnly}
                />
              </div>

              <label className="block text-sm font-medium mb-1 mt-3">
                Số lượng sản phẩm
              </label>
              <input
                type="number"
                name="inventory"
                className="border rounded-lg p-2 w-full"
                onChange={(e) => setInventory(Number(e.target.value))}
                value={inventory}
                disabled={isViewOnly}
              />
            </div>

            {/* Ingredients Section */}
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Thành phần</h3>

              {ingredients.map((ingredient, index) => (
                <div key={index} className="mb-3 p-3 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Thành phần {index + 1}</h4>
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientItem(index)}
                        className="text-red-500 text-sm"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tên thành phần
                      </label>
                      <input
                        type="text"
                        value={ingredient.ingredient_name}
                        onChange={(e) =>
                          updateIngredientItem(
                            index,
                            "ingredient_name",
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-2 w-full"
                        disabled={isViewOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Số lượng thành phần
                      </label>
                      <input
                        type="text"
                        value={ingredient.ingredient_amount}
                        onChange={(e) =>
                          updateIngredientItem(
                            index,
                            "ingredient_amount",
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-2 w-full"
                        disabled={isViewOnly}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {hasError("ingredients") && (
                <ErrorMessage message={errors.ingredients} />
              )}
              <button
                type="button"
                onClick={addIngredientItem}
                className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                + Thêm thành phần mới
              </button>
            </div>

            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Nhà sản xuất</h3>
              <div className="grid grid-cols-2 gap-4">
                <div data-error={hasError("manufacture_name")}>
                  <label className="block text-sm font-medium mb-1">
                    Tên nhà sản xuất <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={manufacturer.manufacture_name}
                    onChange={(e) =>
                      setManufacturer({
                        ...manufacturer,
                        manufacture_name: e.target.value,
                      })
                    }
                    disabled={isViewOnly}
                    className={`border rounded-lg p-2 w-full ${
                      hasError("manufacture_name") ? "border-red-500" : ""
                    }`}
                  />
                  {hasError("manufacture_name") && (
                    <ErrorMessage message={errors.manufacture_name} />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Liên hệ nhà sản xuất
                  </label>
                  <input
                    type="text"
                    value={manufacturer.manufacture_contact}
                    onChange={(e) =>
                      setManufacturer({
                        ...manufacturer,
                        manufacture_contact: e.target.value,
                      })
                    }
                    disabled={isViewOnly}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Địa chỉ sản xuất
                  </label>
                  <input
                    type="text"
                    value={manufacturer.manufacture_address}
                    onChange={(e) =>
                      setManufacturer({
                        ...manufacturer,
                        manufacture_address: e.target.value,
                      })
                    }
                    disabled={isViewOnly}
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Thương hiệu sản phẩm
                  </label>
                  <input
                    type="text"
                    name="brand"
                    className="border rounded-lg p-2 w-full"
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                    disabled={isViewOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 flex flex-col space-y-5">
            {/* Additional Product Details */}
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Giá và đơn vị</h3>
              <div className="space-y-4">
                {prices.map((price, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Tùy chọn giá {index + 1}</h4>
                      {prices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePriceItem(index)}
                          className="text-red-500 text-sm"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 mb-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Giá gốc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={price.original_price}
                          onChange={(e) =>
                            updatePriceItem(
                              index,
                              "original_price",
                              Number(e.target.value)
                            )
                          }
                          disabled={isViewOnly}
                          className="border rounded-lg p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Giảm giá
                        </label>
                        <input
                          type="number"
                          value={price.discount}
                          onChange={(e) =>
                            updatePriceItem(
                              index,
                              "discount",
                              Number(e.target.value)
                            )
                          }
                          disabled={isViewOnly}
                          className="border rounded-lg p-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Số lượng tương ứng
                        </label>
                        <input
                          type="text"
                          value={price.amount}
                          onChange={(e) =>
                            updatePriceItem(index, "amount", e.target.value)
                          }
                          className="border rounded-lg p-2 w-full"
                          disabled={isViewOnly}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Đơn vị <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={price.unit}
                          onChange={(e) =>
                            updatePriceItem(index, "unit", e.target.value)
                          }
                          className="border rounded-lg p-2 w-full"
                          disabled={isViewOnly}
                        >
                          <option value="">Chọn 1 đơn vị</option>
                          {unitOptions.map((unit, idx) => (
                            <option key={idx} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Trọng lượng (kg)
                        </label>
                        <input
                          type="text"
                          value={price.weight}
                          onChange={(e) =>
                            updatePriceItem(index, "weight", e.target.value)
                          }
                          className="border rounded-lg p-2 w-full"
                          disabled={isViewOnly}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {hasError("prices") && <ErrorMessage message={errors.prices} />}
                <button
                  type="button"
                  onClick={addPriceItem}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  + Thêm tùy chọn giá mới
                </button>
              </div>
            </div>
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-3">Hình ảnh</h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  File giấy công bố sản phẩm
                </label>

                <label className="text-sm flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 w-fit">
                  <TbFileTypePdf className="mr-1" />
                  Chọn file PDF
                  <input
                    type="file"
                    name="certificate_file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={certificateInputRef}
                    disabled={isViewOnly}
                  />
                </label>
                {certificate_file && (
                  <div className="relative py-3 rounded-md max-w-xs">
                    {/* Nút x ở góc phải */}
                    <button
                      onClick={removeFile}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-lg font-bold"
                      aria-label="Xóa file"
                      disabled={isViewOnly}
                    >
                      &times;
                    </button>

                    <p className="text-xs text-gray-800">
                      <span className="text-2xl">📄</span>
                      {typeof certificate_file === "string"
                        ? (certificate_file as string)
                            .split("/")
                            .slice(-2)
                            .join("/")
                        : certificate_file?.name}{" "}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ chấp nhận tệp PDF
                </p>
              </div>

              {/* Enhanced Product Images Section */}
              <div data-error={hasError("images")}>
                <label className="block text-sm font-medium mb-1 mt-4">
                  Hình ảnh sản phẩm <span className="text-red-500">*</span>{" "}
                  <span className="text-blue-500">
                    (Cho phép nhiều hình ảnh)
                  </span>
                </label>

                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : hasError("images")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-center py-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>

                    <div className="flex flex-col items-center text-sm text-gray-600">
                      <p className="font-medium">
                        Kéo và thả hình ảnh vào đây hoặc
                      </p>
                      <label className="mt-2 cursor-pointer text-blue-600 hover:text-blue-800">
                        <span>Bấm để chọn tệp</span>
                        <input
                          type="file"
                          name="images"
                          multiple
                          onChange={handleImagesChange}
                          className="hidden"
                          accept="image/*"
                          disabled={isViewOnly}
                        />
                      </label>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 10MB mỗi tệp
                    </p>
                  </div>
                </div>
                {hasError("images") && <ErrorMessage message={errors.images} />}
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">
                        {images.length} ảnh được chọn
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setImages([]);
                          setImagePreviewUrls([]);
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                        disabled={isViewOnly}
                      >
                        Xóa hết
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="h-20 w-20 object-cover rounded border p-2"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            title="Remove"
                            disabled={isViewOnly}
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
              <div data-error={hasError("images_primary")}>
                <label className="block text-sm font-medium mb-1 mt-4">
                  Ảnh chính<span className="text-red-500">*</span>
                </label>
                <label className="flex text-sm items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 w-fit">
                  <BiSolidImageAdd className="mr-1" />
                  Chọn ảnh chính
                  <input
                    type="file"
                    name="images_primary"
                    ref={primaryImageInputRef}
                    onChange={handlePrimaryImageChange}
                    className="hidden"
                    accept="image/*"
                    disabled={isViewOnly}
                  />
                </label>

                {hasError("images_primary") && (
                  <ErrorMessage message={errors.images_primary} />
                )}
                {primaryImagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={primaryImagePreview}
                      alt="Primary image preview"
                      className="h-24 w-24 object-cover rounded border p-2"
                    />
                    <button
                      type="button"
                      onClick={removePrimaryImage}
                      disabled={isViewOnly}
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
        {!detailId && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              type="submit"
              className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
            >
              {editId ? "Cập nhật" : "Tạo sản phẩm"}
            </button>
            <button
              type="button"
              className="text-sm text-red-500 font-semibold py-2 px-6 rounded-lg border border-red-500 hover:bg-red-500 hover:text-white"
            >
              Hủy
            </button>
          </div>
        )}

        {formSubmitted && Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium text-sm">
              Vui lòng sửa các lỗi sau:
            </p>
            <ul className="list-disc pl-5 mt-1 text-xs text-red-500">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
      {detailId && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
            onClick={() => {
              router.push(`/san-pham/them-san-pham-don?edit=${detailId}`);
            }}
          >
            Cập nhật sản phẩm
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateSingleProduct;
