import PresignedImageUpload from '../../components/PresignedImageUpload';

export default function PresignedUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Presigned Upload Demo
            </h1>
            <p className="text-gray-600">
              Upload images directly to organized DigitalOcean Spaces folders using secure presigned URLs
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Images are uploaded to organized folders: <code>/items</code> and <code>/profile</code></li>
              <li>• Presigned URLs provide secure, time-limited upload access</li>
              <li>• Direct client-to-storage upload (no backend processing)</li>
              <li>• Automatic folder organization based on content type</li>
            </ul>
          </div>

          <PresignedImageUpload
            images={[]}
            onImagesChange={() => {}}
            onUploadComplete={(results) => {
              console.log('Upload completed:', results);
            }}
            maxImages={6}
            maxFileSize={5}
            autoUpload={true}
            showOptimizationInfo={true}
            category="item"
            itemId={12345}
          />
        </div>
      </div>
    </div>
  );
}
