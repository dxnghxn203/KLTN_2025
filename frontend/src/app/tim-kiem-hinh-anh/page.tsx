"use client";

import {useState, useRef, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {FiUpload, FiCamera, FiSearch, FiX, FiPlus} from "react-icons/fi";
import {BiLoaderAlt} from "react-icons/bi";
import {BsImage} from "react-icons/bs";
import {useToast} from "@/providers/toastProvider";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_IMAGES = 2;

const Page = () => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isUsingCamera, setIsUsingCamera] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        // Clean up camera stream when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const validateFileSize = (file: File): boolean => {
        if (file.size > MAX_FILE_SIZE) {
            toast.showToast(`Kích thước file quá lớn. Tối đa 2MB`, "error");
            return false;
        }
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [...selectedImages];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (newImages.length >= MAX_IMAGES) {
                toast.showToast(`Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh`, "info");
                break;
            }

            if (!validateFileSize(file)) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    newImages.push(e.target.result as string);
                    setSelectedImages([...newImages]);
                }
            };
            reader.readAsDataURL(file);
        }

        // Reset input to allow uploading the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setIsUsingCamera(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        if (selectedImages.length >= MAX_IMAGES) {
            toast.showToast(`Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh`, "info");
            return;
        }

        const newImages: string[] = [...selectedImages];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (newImages.length >= MAX_IMAGES) break;

            if (!file.type.match('image.*')) continue;
            if (!validateFileSize(file)) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    newImages.push(e.target.result as string);
                    setSelectedImages([...newImages]);
                }
            };
            reader.readAsDataURL(file);
        }

        setIsUsingCamera(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setIsUsingCamera(true);
        } catch (err) {
            toast.showToast("Không thể truy cập camera", "error");
            console.error("Error accessing camera:", err);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && streamRef.current) {
            if (selectedImages.length >= MAX_IMAGES) {
                toast.showToast(`Chỉ được phép chụp tối đa ${MAX_IMAGES} ảnh`, "info");
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/jpeg');
            setSelectedImages([...selectedImages, imageDataUrl]);

            // If we've captured the maximum number of images, stop the camera
            if (selectedImages.length + 1 >= MAX_IMAGES) {
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsUsingCamera(false);
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const resetImages = () => {
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const searchMedication = () => {
        if (selectedImages.length === 0) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to search results with a placeholder image ID
            router.push('/tim-kiem?imageSearch=true');
            toast.showToast("Đã tìm kiếm thành công!", "success");
        }, 2000);
    };

    return (
        <div className="container mx-auto px-4 pt-[120px] pb-20">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
                    Tìm kiếm thuốc bằng hình ảnh
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Chụp hình hoặc tải lên hình ảnh thuốc để tìm kiếm thông tin chi tiết
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 ${
                            !isUsingCamera
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                    >
                        <FiUpload className="text-xl"/>
                        <span>Tải ảnh lên ({selectedImages.length}/{MAX_IMAGES})</span>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <button
                        onClick={isUsingCamera ? stopCamera : startCamera}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 ${
                            isUsingCamera
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                    >
                        <FiCamera className="text-xl"/>
                        <span>{isUsingCamera ? "Dừng camera" : "Chụp ảnh"}</span>
                    </button>
                </div>

                {/* Camera View */}
                {isUsingCamera && (
                    <div className="relative mb-6 bg-black rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-[300px] md:h-[400px] object-cover"
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <button
                                onClick={capturePhoto}
                                className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors"
                                disabled={selectedImages.length >= MAX_IMAGES}
                            >
                                <div className="w-12 h-12 rounded-full border-4 border-blue-500"></div>
                            </button>
                        </div>

                        {selectedImages.length > 0 && (
                            <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-2">
                                <span
                                    className="text-white text-sm font-medium">{selectedImages.length}/{MAX_IMAGES} ảnh</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Area - show if no camera and no images */}
                {!isUsingCamera && selectedImages.length === 0 && (
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center flex flex-col items-center justify-center gap-4 h-[300px] md:h-[400px] bg-gray-50"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <BsImage className="text-5xl text-gray-400"/>
                        <div>
                            <p className="text-gray-600 mb-2">
                                Kéo và thả hình ảnh vào đây hoặc{" "}
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    chọn từ thiết bị
                                </button>
                            </p>
                            <p className="text-gray-500 text-sm">
                                Hỗ trợ: JPG, PNG, GIF (tối đa 2MB/ảnh)
                            </p>
                        </div>
                    </div>
                )}

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && !isUsingCamera && (
                    <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedImages.map((image, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden h-[200px] bg-gray-100">
                                    <Image
                                        src={image}
                                        alt={`Hình ảnh thuốc ${index + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90"
                                    >
                                        <FiX/>
                                    </button>
                                </div>
                            ))}

                            {selectedImages.length < MAX_IMAGES && (
                                <div
                                    className="flex items-center justify-center h-[200px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="flex flex-col items-center text-gray-500">
                                        <FiPlus className="text-3xl mb-2"/>
                                        <span>Thêm ảnh</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={resetImages}
                            className="mt-4 text-red-600 hover:text-red-800 text-sm flex items-center"
                        >
                            <FiX className="mr-1"/> Xóa tất cả ảnh
                        </button>
                    </div>
                )}

                {/* Search Button */}
                {selectedImages.length > 0 && !isUsingCamera && (
                    <button
                        onClick={searchMedication}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <BiLoaderAlt className="text-xl animate-spin"/>
                                <span>Đang tìm kiếm...</span>
                            </>
                        ) : (
                            <>
                                <FiSearch className="text-xl"/>
                                <span>Tìm kiếm thông tin thuốc</span>
                            </>
                        )}
                    </button>
                )}

                {/* Examples and Tips */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Lưu ý khi chụp ảnh</h3>
                    <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                        <li>Đảm bảo ảnh rõ nét và không bị mờ</li>
                        <li>Chụp cận cảnh bao bì hoặc vỉ thuốc để dễ nhận diện</li>
                        <li>Ánh sáng đầy đủ để thấy rõ màu sắc và thông tin</li>
                        <li>Nếu có thể, chụp cả mặt trước và mặt sau của hộp thuốc</li>
                        <li>Mỗi ảnh không vượt quá 2MB</li>
                    </ul>
                    <p className="mt-4 text-sm text-gray-500 italic">
                        Lưu ý: Tính năng tìm kiếm bằng hình ảnh đang trong giai đoạn thử nghiệm. Độ chính xác có thể
                        chưa hoàn hảo.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
