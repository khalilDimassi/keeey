import { RotateCcw, X, Save, Upload, Link } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { saveProfileImage } from "../../services";

const ImageCropper = ({ imageUrl, onSave, onCancel }: {
    imageUrl: string;
    onSave: (url: string, cropData: { x: number; y: number; size: number }) => void;
    onCancel: () => void
}) => {
    const [cropData, setCropData] = useState({ x: 0, y: 0, size: 200 });
    const [dragStart, setDragStart] = useState<{
        x: number;
        y: number;
        cropX: number;
        cropY: number;
        cropSize: number;
        containerRect: DOMRect;
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Configuration constants
    const IMAGE_SIZE = 320;
    const MIN_CROP_SIZE = 50;
    const MAX_CROP_SIZE = IMAGE_SIZE;
    const MOVEMENT_SENSITIVITY = 0.8;
    const RESIZE_SENSITIVITY = 0.8;

    // Global mouse event listeners for when cursor leaves container
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!dragStart || (!isDragging && !isResizing)) return;

            // Calculate movement relative to container
            const containerRect = dragStart.containerRect;
            const x = e.clientX - containerRect.left;
            const y = e.clientY - containerRect.top;
            const deltaX = (x - dragStart.x) * MOVEMENT_SENSITIVITY;
            const deltaY = (y - dragStart.y) * MOVEMENT_SENSITIVITY;

            if (isDragging) {
                const centerX = dragStart.cropX + dragStart.cropSize / 2;
                const centerY = dragStart.cropY + dragStart.cropSize / 2;
                const newCenterX = centerX + deltaX;
                const newCenterY = centerY + deltaY;

                setCropData(prev => ({
                    ...prev,
                    x: Math.max(0, Math.min(IMAGE_SIZE - prev.size, newCenterX - prev.size / 2)),
                    y: Math.max(0, Math.min(IMAGE_SIZE - prev.size, newCenterY - prev.size / 2))
                }));
            } else if (isResizing) {
                const resizeDelta = Math.max(deltaX, deltaY) * RESIZE_SENSITIVITY;
                const newSize = Math.max(MIN_CROP_SIZE, Math.min(MAX_CROP_SIZE, dragStart.cropSize + resizeDelta));

                setCropData(prev => ({
                    ...prev,
                    size: newSize,
                    x: Math.max(0, Math.min(IMAGE_SIZE - newSize, prev.x)),
                    y: Math.max(0, Math.min(IMAGE_SIZE - newSize, prev.y))
                }));
            }
        };

        const handleGlobalMouseUp = () => {
            setDragStart(null);
            setIsDragging(false);
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);

            if (isDragging) {
                document.body.style.cursor = 'move';
            } else if (isResizing) {
                document.body.style.cursor = 'se-resize';
            }
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [dragStart, isDragging, isResizing, MOVEMENT_SENSITIVITY, RESIZE_SENSITIVITY, IMAGE_SIZE, MIN_CROP_SIZE, MAX_CROP_SIZE]);

    const handleMouseDown = useCallback((e: React.MouseEvent, type: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;

        setDragStart({
            x,
            y,
            cropX: cropData.x,
            cropY: cropData.y,
            cropSize: cropData.size,
            containerRect
        });

        if (type === 'move') {
            setIsDragging(true);
        } else if (type === 'resize') {
            setIsResizing(true);
        }
    }, [cropData]);

    const getCroppedPreview = (ringSize: number) => {
        const scale = ringSize === 4 ? 1 : ringSize === 2 ? 0.7 : 0.5;
        const size = 80 * scale;
        return (
            <div className={`relative bg-white rounded-full shadow-lg ring-${ringSize} ring-teal-100 flex-shrink-0`}
                style={{ width: size + 16, height: size + 16 }}>
                <div
                    className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: `${IMAGE_SIZE * (size / cropData.size)}px`,
                        backgroundPosition: `-${cropData.x * (size / cropData.size)}px -${cropData.y * (size / cropData.size)}px`,
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            </div>
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveProfileImage(imageUrl, cropData);
            onSave(imageUrl, cropData);
        } catch (error) {
            console.error('❌ Failed to save image:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const resetCrop = () => {
        setCropData({ x: 50, y: 50, size: 200 });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ajuster l'image</h3>
                    <div
                        ref={containerRef}
                        className="relative w-80 h-80 mx-auto bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 select-none"
                    >
                        <img
                            ref={imageRef}
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false}
                        />

                        {/* Crop overlay */}
                        <div
                            className="absolute border-2 border-white shadow-lg rounded-full cursor-move"
                            style={{
                                left: cropData.x,
                                top: cropData.y,
                                width: cropData.size,
                                height: cropData.size,
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'move')}
                        >
                            {/* Resize handle */}
                            <div
                                className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-black rounded-full cursor-se-resize hover:bg-teal-50 transition-colors"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleMouseDown(e, 'resize');
                                }}
                                style={{ zIndex: 10 }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={resetCrop}
                            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            <RotateCcw size={16} />
                            Réinitialiser
                        </button>
                    </div>

                    {/* Sensitivity controls for testing */}
                    <div className="text-center mt-2 text-xs text-gray-500">
                        Movement: {MOVEMENT_SENSITIVITY}x | Resize: {RESIZE_SENSITIVITY}x
                    </div>
                </div>

                {/* Preview panel */}
                <div className="w-full lg:w-64">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Aperçu</h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Grande (ring-4)</div>
                                <div className="flex justify-center">
                                    {getCroppedPreview(4)}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Moyenne (ring-2)</div>
                                <div className="flex justify-center">
                                    {getCroppedPreview(2)}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Petite (ring-1)</div>
                                <div className="flex justify-center">
                                    {getCroppedPreview(1)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                    <X size={18} />
                    Annuler
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                    <Save size={18} />
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
            </div>
        </div>
    );
};

export const LinkImagePopup = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (finalUrl: string, cropData: { x: number; y: number; size: number }) => void }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCropper, setShowCropper] = useState(false);

    const handleUrlSubmit = async () => {
        if (!imageUrl.trim()) {
            setError('Veuillez entrer une URL d\'image');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Validate image URL
            const img = new Image();
            img.onload = () => {
                setIsLoading(false);
                setShowCropper(true);
            };
            img.onerror = () => {
                setIsLoading(false);
                setError('URL d\'image invalide ou inaccessible');
            };
            img.src = imageUrl;
        } catch (err) {
            setIsLoading(false);
            setError('Erreur lors du chargement de l\'image');
        }
    };

    const handleSave = (finalUrl: string, cropData: { x: number; y: number; size: number }) => {
        onSave(finalUrl, cropData);
        handleClose();
    };

    const handleClose = () => {
        setImageUrl('');
        setShowCropper(false);
        setError('');
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Link className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Ajouter une image par URL</h2>
                                <p className="text-gray-600 text-sm">Collez l'URL d'une image pour l'utiliser comme photo de profil</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {!showCropper ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    URL de l'image
                                </label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://exemple.com/image.jpg"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="text-red-600 text-sm">{error}</div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleUrlSubmit}
                                    disabled={isLoading || !imageUrl.trim()}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Chargement...' : 'Charger l\'image'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ImageCropper
                            imageUrl={imageUrl}
                            onSave={handleSave}
                            onCancel={handleClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const FileImagePopup = ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (finalUrl: string, cropData: { x: number; y: number; size: number }) => void }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            const file = files[0];
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setShowCropper(true);
        }
    };

    const handleSave = async (finalUrl: string, cropData: { x: number; y: number; size: number; }) => {
        // In a real app, you'd upload the cropped file here
        onSave(finalUrl, cropData);
        handleClose();
    };

    const handleClose = () => {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setSelectedFile(null);
        setImageUrl('');
        setShowCropper(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Upload className="text-green-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Télécharger une image</h2>
                                <p className="text-gray-600 text-sm">Sélectionnez une image depuis votre appareil</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {!showCropper ? (
                        <div className="space-y-6">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div
                                onClick={triggerFileSelect}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="text-green-600" size={24} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                    Glissez-déposez une image ici
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    ou cliquez pour parcourir vos fichiers
                                </p>
                                <div className="text-sm text-gray-500">
                                    JPG, PNG, GIF jusqu'à 10MB
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ImageCropper
                            imageUrl={imageUrl}
                            onSave={handleSave}
                            onCancel={handleClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};