import { SquarePen } from "lucide-react";
import { Button, Input, Modal, ModalBackdrop } from "@heroui/react";

export function ImageUploadModal({
  handleImageUpload,
  imageUploadLoading,
}: {
  handleImageUpload: (e: React.FormEvent<HTMLFormElement>) => void;
  imageUploadLoading: boolean;
}) {
  return (
    <Modal>
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-0 right-0 bg-gray-200 rounded-full shadow-md cursor-pointer"
      >
        <SquarePen color="blue" size={20} />
      </Button>
      <ModalBackdrop variant={"blur"}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Update Profile Picture</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <form
                id="uploadForm"
                onSubmit={handleImageUpload}
                className="text-white w-full"
              >
                <Input
                  variant="secondary"
                  type="file"
                  name="profile"
                  accept="image/*"
                  className="w-full"
                />
              </form>
              <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className={
                  "w-full" + (imageUploadLoading ? " cursor-not-allowed " : "")
                }
                form="uploadForm"
                type="submit"
              >
                {imageUploadLoading ? "Uploading..." : "Upload"}
                {imageUploadLoading && (
                  <div className="loader border-4 border-gray-200 h-5 w-5 ml-2 rounded-full"></div>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </ModalBackdrop>
    </Modal>
  );
}
