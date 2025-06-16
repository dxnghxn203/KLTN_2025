"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DynamicReactQuill from "../Product/CreateProduct/dynamicReactQuill";
import { useArticle } from "@/hooks/useArticle";
import { useToast } from "@/providers/toastProvider";
import { MdOutlineEdit } from "react-icons/md";

type TagItem = {
  tag_name: string;
};

const EditArticle = () => {
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    created_by: "",
    category: "",
    updated_date: "",
    slug: "",
  });
  const [tags, setTags] = useState<TagItem[]>([{ tag_name: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalArticleData, setOriginalArticleData] = useState<any>(null); // or better, use proper type

  const {
    fetchUpdateArticleAdmin,
    fetchAllArticlesAdmin,
    getAllArticlesAdmin,
    fetchUpdateLogoArticleAdmin,
  } = useArticle();
  const toast = useToast();
  const searchParams = useSearchParams();
  const updateId = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    if (!updateId) return;
    fetchAllArticlesAdmin(
      () => {
        const article = getAllArticlesAdmin.find(
          (item: any) => item.article_id.toString() === updateId
        );
        if (article) {
          const updatedDate = article.updated_date
            ? article.updated_date.split("T")[0]
            : "";

          const tagsArray = Array.isArray(article.tags)
            ? article.tags.map((tag: any) => ({
                tag_name: tag.tag_name || tag,
              }))
            : [];

          setArticleData({
            title: article.title,
            content: article.content,
            created_by: article.created_by,
            category: article.category,
            updated_date: updatedDate,
            slug: article.slug,
          });
          setTags(tagsArray);
          setPreviewImage(article.image_thumbnail || null);

          // ❗ Lưu dữ liệu gốc để so sánh sau này
          setOriginalArticleData({
            title: article.title,
            content: article.content,
            created_by: article.created_by,
            category: article.category,
            slug: article.slug,
            tags: tagsArray.map((tag: any) => tag.tag_name),
          });
        }
      },
      () => toast.showToast("Không thể tải danh sách bài viết", "error")
    );
  }, [updateId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setArticleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      setIsImageChanged(true);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index].tag_name = value;
    setTags(newTags);
  };

  const handleContentChange = useCallback((value: string) => {
    setArticleData((prev) => ({ ...prev, content: value }));
  }, []);

  const handleTitleChange = useCallback((value: string) => {
    setArticleData((prev) => ({ ...prev, title: value }));
  }, []);

  const addTag = () => setTags([...tags, { tag_name: "" }]);

  const removeTag = (index: number) =>
    setTags(tags.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    // Kiểm tra xem có thay đổi gì không
    const body = {
      article_id: updateId,
      title: articleData.title,
      content: articleData.content,
      created_by: articleData.created_by,
      category: articleData.category,
      tags: tags.map((tag) => tag.tag_name).filter((tag) => tag.trim() !== ""),
      slug: articleData.slug,
    };

    const normalize = (str: string) => str?.replace(/\s+/g, " ")?.trim();

    const isContentChanged =
      originalArticleData &&
      (normalize(body.title) !== normalize(originalArticleData.title) ||
        normalize(body.content) !== normalize(originalArticleData.content) ||
        normalize(body.created_by) !==
          normalize(originalArticleData.created_by) ||
        normalize(body.category) !== normalize(originalArticleData.category) ||
        normalize(body.slug) !== normalize(originalArticleData.slug) ||
        JSON.stringify(body.tags.sort()) !==
          JSON.stringify(originalArticleData.tags.sort()));

    console.log("isContentChanged", isContentChanged);

    if (!isContentChanged && !isImageChanged) {
      toast.showToast("Không có thay đổi nào để cập nhật", "info");
      return;
    }

    // Mảng để theo dõi các hoạt động cập nhật
    const updatePromises = [];
    let hasError = false;
    console.log("isImageChanged", isImageChanged);
    console.log("isContentChanged", isContentChanged);

    if (isContentChanged) {
      const contentUpdatePromise = new Promise((resolve, reject) => {
        fetchUpdateArticleAdmin(
          body,
          () => {
            toast.showToast("Cập nhật nội dung bài viết thành công", "success");
            resolve(true);
          },
          () => {
            toast.showToast("Cập nhật nội dung bài viết thất bại!", "error");
            hasError = true;
            reject("Đã xảy ra lỗi khi cập nhật nội dung bài viết");
          }
        );
      });

      updatePromises.push(contentUpdatePromise);
    }

    if (isImageChanged && image) {
      const formData = new FormData();
      formData.append("article_id", updateId || "");
      formData.append("image", image);

      const imageUpdatePromise = new Promise((resolve, reject) => {
        fetchUpdateLogoArticleAdmin(
          formData,
          updateId,
          () => {
            toast.showToast("Cập nhật ảnh bài viết thành công", "success");

            resolve(true);
          },
          () => {
            toast.showToast("Cập nhật ảnh bài viết thất bại!", "error");
            hasError = true;
            reject("Đã xảy ra lỗi khi cập nhật ảnh bài viết");
          }
        );
      });

      updatePromises.push(imageUpdatePromise);
    }

    try {
      await Promise.all(updatePromises);
      setTimeout(() => {
        router.push("/quan-ly-bai-viet");
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      // Lỗi đã được xử lý trong từng promise
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-black">Cập nhật bài viết</h2>

      <div className="my-4 text-sm">
        <Link href="/dashboard" className="hover:underline text-blue-600">
          Dashboard
        </Link>
        <span> / </span>
        <Link href="/quan-ly-bai-viet" className="text-gray-850">
          Quản lý Bài viết
        </Link>
        <span> / </span>
        <span className="text-gray-850">Cập nhật bài viết</span>
      </div>

      {/* Hình ảnh */}
      <div className="w-40">
        <label className="block mb-1 text-gray-600">Hình ảnh</label>
        {previewImage && (
          <div className="relative mb-4">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
              title="Chỉnh sửa ảnh"
            >
              <MdOutlineEdit className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>

      {/* Tiêu đề */}
      <div>
        <label className="block mb-1 text-gray-600">Tiêu đề bài viết</label>
        <DynamicReactQuill
          value={articleData.title}
          onChange={handleTitleChange}
        />
      </div>

      {/* Nội dung */}
      <div>
        <label className="block mb-1 text-gray-600">Nội dung</label>
        <DynamicReactQuill
          value={articleData.content}
          onChange={handleContentChange}
        />
      </div>

      {/* Tác giả */}
      <div>
        <label className="block mb-1 text-gray-600">Tác giả</label>
        <input
          type="text"
          name="created_by"
          value={articleData.created_by}
          onChange={handleInputChange}
          className="border rounded-lg p-2 w-full"
          placeholder="Nhập tên tác giả"
        />
      </div>

      {/* Danh mục */}
      <div>
        <label className="block mb-1 text-gray-600">Danh mục</label>
        <input
          type="text"
          name="category"
          value={articleData.category}
          onChange={handleInputChange}
          className="border rounded-lg p-2 w-full"
          placeholder="Nhập danh mục"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-1 text-gray-600">Slug</label>
        <input
          type="text"
          name="slug"
          value={articleData.slug}
          onChange={handleInputChange}
          className="border rounded-lg p-2 w-full"
          placeholder="Nhập slug"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block mb-1 text-gray-600">Tags</label>
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={tag.tag_name}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
            {tags.length > 1 && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-red-500"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTag}
          className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Thêm tag mới
        </button>
      </div>

      {/* Ngày cập nhật */}
      <div>
        <label className="block mb-1 text-gray-600">Ngày cập nhật</label>
        <input
          type="text"
          name="updated_date"
          value={articleData.updated_date}
          onChange={handleInputChange}
          className="border rounded-lg p-2 w-full"
          placeholder="Nhập ngày cập nhật"
        />
      </div>

      {/* Nút lưu */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          Lưu bài viết
        </button>
      </div>
    </div>
  );
};

export default EditArticle;
