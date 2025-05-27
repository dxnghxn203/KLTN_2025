"use client";

import {useState, useRef, useEffect} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {FiUpload, FiCamera, FiSearch, FiX, FiPlus} from "react-icons/fi";
import {BiLoaderAlt} from "react-icons/bi";
import {BsImage} from "react-icons/bs";
import {useToast} from "@/providers/toastProvider";
import {useProduct} from "@/hooks/useProduct";

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
    const {
        imageToProduct,
        fetchImageToProduct
    } = useProduct();

    useEffect(() => {
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

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setIsUsingCamera(false);
    };

    const [showResults, setShowResults] = useState(false);

    const backToImageInput = () => {
        setShowResults(false);
    };

    const searchMedication = () => {
        if (selectedImages.length === 0) return;

        setIsLoading(true);

        const imageFiles = selectedImages.map((base64, index) => {
            const byteString = atob(base64.split(',')[1]);
            const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new File([ab], `image-${index}.jpg`, {type: mimeString});
        });

        fetchImageToProduct(
            imageFiles,
            () => {
                setIsLoading(false);
                setShowResults(true);
            },
            () => {
                setIsLoading(false);
                toast.showToast("Không thể tìm kiếm với hình ảnh này", "error");
            }
        );
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

    return (
        <div className="container mx-auto px-4 pt-[120px] pb-20">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
                    Tìm kiếm thuốc bằng hình ảnh
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Chụp hình hoặc tải lên hình ảnh thuốc để tìm kiếm thông tin chi tiết
                </p>

                {!showResults ? (
                    <>
                        {/* Image input UI */}
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

                        {selectedImages.length > 0 && !isUsingCamera && (
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedImages.map((image, index) => (
                                        <div key={index}
                                             className="relative rounded-lg overflow-hidden h-[200px] bg-gray-100">
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

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Lưu ý khi chụp ảnh</h3>
                            <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                                <li>Đảm bảo ảnh rõ nét và không bị mờ</li>
                                <li>Chụp cận cảnh bao bì hoặc vỉ thuốc để dễ nhận diện</li>
                                <li>Ánh sáng đầy đủ để thấy rõ màu sắc và thông tin</li>
                                <li>Nếu có thể, chụp cả mặt trước và mặt sau của hộp thuốc</li>
                                <li>Mỗi ảnh không vượt quá 2MB</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="search-results animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={backToImageInput}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-all px-4 py-2 rounded-full hover:bg-blue-50"
                            >
                                <FiCamera className="text-lg"/>
                                <span>Chụp ảnh mới</span>
                            </button>

                            <div className="text-sm text-gray-500 italic">
                                {selectedImages.length} ảnh được sử dụng để tìm kiếm
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center gap-2">
                            <FiSearch className="text-blue-600"/> Kết quả tìm kiếm
                        </h2>

                        {imageToProduct && imageToProduct.drugs && imageToProduct.drugs.length > 0 ? (
                            <div className="space-y-8">
                                {imageToProduct.drugs.map((drug: any, index: any) => (
                                    <div key={index}
                                         className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div
                                            className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-gray-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-blue-800">{drug.name}</h3>
                                                    {drug.brand && (
                                                        <div className="flex items-center mt-2 text-gray-600">
                                                            <span className="font-medium mr-2">Thương hiệu:</span>
                                                            <span className="text-gray-800">{drug.brand}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Product Image - Left Side */}
                                                <div className="md:w-1/3">
                                                    <div
                                                        className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center border border-gray-200">
                                                        {selectedImages && selectedImages.length > index ? (
                                                            <Image
                                                                src={selectedImages[index]}
                                                                alt={`Hình ảnh ${drug.name}`}
                                                                width={300}
                                                                height={300}
                                                                className="object-contain max-h-[250px]"
                                                            />
                                                        ) : (
                                                            <div className="text-center text-gray-400">
                                                                <BsImage className="text-5xl mx-auto mb-2"/>
                                                                <p>Không có hình ảnh</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Product Information - Right Side */}
                                                <div className="md:w-2/3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            {drug.dosage_form && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                        Dạng bào chế:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.dosage_form}</span>
                                                                </div>
                                                            )}

                                                            {drug.origin && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                        Xuất xứ:
                                                    </span>
                                                                    <span className="text-gray-800">{drug.origin}</span>
                                                                </div>
                                                            )}

                                                            {drug.manufacturer && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                        Nhà sản xuất:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.manufacturer}</span>
                                                                </div>
                                                            )}

                                                            {drug.active_ingredients && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                        Hoạt chất:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.active_ingredients}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            {drug.serial_number && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                        Số seri:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.serial_number}</span>
                                                                </div>
                                                            )}

                                                            {drug.registration_number && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                        Số đăng ký:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.registration_number}</span>
                                                                </div>
                                                            )}

                                                            {drug.expiration_date && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                        Hạn sử dụng:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.expiration_date}</span>
                                                                </div>
                                                            )}

                                                            {drug.batch_number && (
                                                                <div className="flex items-start mb-4">
                                                    <span
                                                        className="font-medium text-gray-700 min-w-[140px] flex items-center">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                        Số lô:
                                                    </span>
                                                                    <span
                                                                        className="text-gray-800">{drug.batch_number}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {drug.additional_info && Object.keys(drug.additional_info).length > 0 && (
                                                        <div className="mt-6">
                                                            <h4 className="font-semibold text-gray-900 uppercase text-sm tracking-wider mb-3 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                     className="h-5 w-5 mr-2 text-blue-600"
                                                                     viewBox="0 0 24 24" fill="none"
                                                                     stroke="currentColor" strokeWidth="2"
                                                                     strokeLinecap="round" strokeLinejoin="round">
                                                                    <path
                                                                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                                                    <path d="m9 12 2 2 4-4"></path>
                                                                </svg>
                                                                Thông tin bổ sung
                                                            </h4>
                                                            <div
                                                                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-inner">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {drug.additional_info.intelli_sense && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path
                                                                                    d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"></path>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Intelli Sense:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">{drug.additional_info.intelli_sense}</span>
                                                                        </div>
                                                                    )}

                                                                    {drug.additional_info.clinical_approval && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path d="m9 12 2 2 4-4"></path>
                                                                                <path
                                                                                    d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"></path>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Chứng nhận:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">{drug.additional_info.clinical_approval}</span>
                                                                        </div>
                                                                    )}

                                                                    {drug.additional_info.ideal_for_basic_measurement && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path
                                                                                    d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                                                                <circle cx="12" cy="12" r="3"></circle>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Lý tưởng cho đo lường cơ bản:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">Có</span>
                                                                        </div>
                                                                    )}

                                                                    {drug.additional_info.warranty && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <rect x="3" y="4" width="18" height="18"
                                                                                      rx="2" ry="2"></rect>
                                                                                <line x1="16" y1="2" x2="16"
                                                                                      y2="6"></line>
                                                                                <line x1="8" y1="2" x2="8"
                                                                                      y2="6"></line>
                                                                                <line x1="3" y1="10" x2="21"
                                                                                      y2="10"></line>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Bảo hành:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">{drug.additional_info.warranty}</span>
                                                                        </div>
                                                                    )}

                                                                    {drug.additional_info.storage_temperature && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path
                                                                                    d="M20 9v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"></path>
                                                                                <path
                                                                                    d="M9 3h6a2 2 0 0 1 2 2v4H7V5a2 2 0 0 1 2-2z"></path>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Nhiệt độ bảo quản:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">{drug.additional_info.storage_temperature}</span>
                                                                        </div>
                                                                    )}

                                                                    {drug.additional_info.prescribing_information && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path
                                                                                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Thông tin kê đơn:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">{drug.additional_info.prescribing_information}</span>
                                                                        </div>
                                                                    )}

                                                                    {drug.additional_info.package_quantity && (
                                                                        <div
                                                                            className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 className="h-5 w-5 mr-2 text-blue-600"
                                                                                 viewBox="0 0 24 24" fill="none"
                                                                                 stroke="currentColor" strokeWidth="2"
                                                                                 strokeLinecap="round"
                                                                                 strokeLinejoin="round">
                                                                                <path
                                                                                    d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-2"></path>
                                                                                <path d="m3.3 7 8.7 5 8.7-5"></path>
                                                                                <path d="M12 22V12"></path>
                                                                            </svg>
                                                                            <span
                                                                                className="font-medium text-gray-700 mr-2">Quy cách đóng gói:</span>
                                                                            <span
                                                                                className="text-gray-800 font-medium">{drug.additional_info.package_quantity}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-md">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                 strokeWidth="2" strokeLinecap="round"
                                                                 strokeLinejoin="round">
                                                                <circle cx="9" cy="21" r="1"></circle>
                                                                <circle cx="20" cy="21" r="1"></circle>
                                                                <path
                                                                    d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                            </svg>
                                                            Tìm kiếm sản phẩm tại cửa hàng
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-gray-100 rounded-full">
                                        <FiSearch className="text-5xl text-gray-400"/>
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-xl font-medium mb-2">Không tìm thấy kết quả nào phù
                                    hợp</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">Vui lòng thử lại với hình ảnh khác
                                    hoặc kiểm tra chất lượng hình ảnh của bạn</p>
                                <button
                                    onClick={backToImageInput}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
                                >
                                    <FiCamera/>
                                    Thử với ảnh khác
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
