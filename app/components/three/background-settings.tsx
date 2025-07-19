"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, X } from "lucide-react";
import { useBackground } from "./background-context";
import { starPresets } from "@/components/three/star-effects-builder";
import type { BackgroundEffectType } from "@/components/three/background-effects";

export function BackgroundSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    effectType,
    setEffectType,
    showControls,
    setShowControls,
    currentPreset,
    setCurrentPreset,
  } = useBackground();

  return (
    <>
      {/* Settings toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
        title="Background Settings"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* Settings panel */}
      {isOpen && (
        <Card className="fixed top-16 left-4 z-50 w-80 bg-background/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Background Settings</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Effect Type */}
            <div className="space-y-2">
              <Label>Effect Type</Label>
              <Select
                value={effectType}
                onValueChange={(value: BackgroundEffectType) =>
                  setEffectType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Adaptive)</SelectItem>
                  <SelectItem value="starfield">Starfield (3D)</SelectItem>
                  <SelectItem value="particles">Particles (2D)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show Controls */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={showControls}
                onCheckedChange={setShowControls}
              />
              <Label>Show Effect Controls</Label>
            </div>

            {/* Preset Selection */}
            {effectType !== "particles" && (
              <div className="space-y-2">
                <Label>Starfield Preset</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(starPresets).map((preset) => (
                    <Badge
                      key={preset}
                      variant={currentPreset === preset ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setCurrentPreset(preset)}
                    >
                      {preset}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="font-medium">Performance Tips:</div>
              <div>• Auto mode adapts to device capabilities</div>
              <div>• Starfield uses WebGL (better quality)</div>
              <div>• Particles use Canvas (better compatibility)</div>
              <div>• Lower star counts improve performance</div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
