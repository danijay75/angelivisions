"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { getCroppedImg } from "@/lib/utils/image-utils"
import { RotateCcw, ZoomIn, Crop } from "lucide-react"

interface ImageCropperProps {
  imageSrc: string
  open: boolean
  onClose: () => void
  onCompleted: (croppedImage: Blob) => void
  aspect?: number
}

export default function ImageCropper({
  imageSrc,
  open,
  onClose,
  onCompleted,
  aspect = 1,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      if (croppedImage) {
        onCompleted(croppedImage)
      }
    } catch (e) {
      console.error(e)
    }
  }, [imageSrc, croppedAreaPixels, rotation, onCompleted])

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-purple-400" />
            Modifier l'image
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-[400px] w-full bg-black/50 rounded-lg overflow-hidden mt-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-white/70">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Zoom
              </div>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(vals) => setZoom(vals[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-white/70">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Rotation
              </div>
              <span>{rotation}°</span>
            </div>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(vals) => setRotation(vals[0])}
              className="py-4"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="hover:bg-white/10 text-white">
            Annuler
          </Button>
          <Button
            onClick={showCroppedImage}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Valider la modification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
