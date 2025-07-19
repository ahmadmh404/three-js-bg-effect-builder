"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import {
  ColorScheme,
  DirectionPreset,
  SizeDistribution,
  SpeedPattern,
  StarConfig,
  StarMaterialType,
  starPresets,
} from "@/components/three/star-effects-builder";

interface StarEffectsPanelProps {
  config: StarConfig;
  onConfigChange: (config: Partial<StarConfig>) => void;
  onPresetLoad: (preset: string) => void;
}

export function StarEffectsPanel({
  config,
  onConfigChange,
  onPresetLoad,
}: StarEffectsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-20 right-4 z-40">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="mb-2 bg-background/80 backdrop-blur-sm"
      >
        ⭐ Star Effects
      </Button>

      {true && (
        <Card className="w-80 max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Star Effects Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="motion">Motion</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {/* Presets */}
                <div className="space-y-2">
                  <Label>Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(starPresets).map((preset) => (
                      <Badge
                        key={preset}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => onPresetLoad(preset)}
                      >
                        {preset}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Star Count */}
                <div className="space-y-2">
                  <Label>Star Count: {config.count}</Label>
                  <Slider
                    value={[config.count]}
                    onValueChange={([value]) =>
                      onConfigChange({ count: value })
                    }
                    min={100}
                    max={5000}
                    step={100}
                  />
                </div>

                {/* Material Type */}
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select
                    value={config.material}
                    onValueChange={(value: StarMaterialType) =>
                      onConfigChange({ material: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="points">Points</SelectItem>
                      <SelectItem value="glow">Glow</SelectItem>
                      <SelectItem value="sprite">Sprite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="space-y-4">
                {/* Color Scheme */}
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={
                      typeof config.colors === "string"
                        ? config.colors
                        : "custom"
                    }
                    onValueChange={(value: ColorScheme) =>
                      onConfigChange({ colors: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="cool">Cool</SelectItem>
                      <SelectItem value="rainbow">Rainbow</SelectItem>
                      <SelectItem value="galaxy">Galaxy</SelectItem>
                      <SelectItem value="nebula">Nebula</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Distribution */}
                <div className="space-y-2">
                  <Label>Size Distribution</Label>
                  <Select
                    value={config.sizes.distribution}
                    onValueChange={(value: SizeDistribution) =>
                      onConfigChange({
                        sizes: { ...config.sizes, distribution: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uniform">Uniform</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="clustered">Clustered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Range */}
                <div className="space-y-2">
                  <Label>
                    Size Range: {config.sizes.min} - {config.sizes.max}
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[config.sizes.min]}
                      onValueChange={([value]) =>
                        onConfigChange({
                          sizes: { ...config.sizes, min: value },
                        })
                      }
                      min={0.1}
                      max={10}
                      step={0.1}
                    />
                    <Slider
                      value={[config.sizes.max]}
                      onValueChange={([value]) =>
                        onConfigChange({
                          sizes: { ...config.sizes, max: value },
                        })
                      }
                      min={0.1}
                      max={10}
                      step={0.1}
                    />
                  </div>
                </div>

                {/* Opacity Range */}
                <div className="space-y-2">
                  <Label>
                    Opacity Range: {config.opacity.min.toFixed(1)} -{" "}
                    {config.opacity.max.toFixed(1)}
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[config.opacity.min]}
                      onValueChange={([value]) =>
                        onConfigChange({
                          opacity: { ...config.opacity, min: value },
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                    <Slider
                      value={[config.opacity.max]}
                      onValueChange={([value]) =>
                        onConfigChange({
                          opacity: { ...config.opacity, max: value },
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="motion" className="space-y-4">
                {/* Direction */}
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select
                    value={
                      typeof config.direction === "string"
                        ? config.direction
                        : "custom"
                    }
                    onValueChange={(value: DirectionPreset) =>
                      onConfigChange({ direction: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="outward">Outward</SelectItem>
                      <SelectItem value="inward">Inward</SelectItem>
                      <SelectItem value="spiral">Spiral</SelectItem>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="orbit">Orbit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Pattern */}
                <div className="space-y-2">
                  <Label>Speed Pattern</Label>
                  <Select
                    value={config.speed.pattern}
                    onValueChange={(value: SpeedPattern) =>
                      onConfigChange({
                        speed: { ...config.speed, pattern: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="constant">Constant</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="pulsing">Pulsing</SelectItem>
                      <SelectItem value="accelerating">Accelerating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Range */}
                <div className="space-y-2">
                  <Label>
                    Speed Range: {config.speed.min.toFixed(3)} -{" "}
                    {config.speed.max.toFixed(3)}
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[config.speed.min]}
                      onValueChange={([value]) =>
                        onConfigChange({
                          speed: { ...config.speed, min: value },
                        })
                      }
                      min={0.001}
                      max={0.1}
                      step={0.001}
                    />
                    <Slider
                      value={[config.speed.max]}
                      onValueChange={([value]) =>
                        onConfigChange({
                          speed: { ...config.speed, max: value },
                        })
                      }
                      min={0.001}
                      max={0.1}
                      step={0.001}
                    />
                  </div>
                </div>

                {/* Boundary Wrapping */}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.boundaries.wrap}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        boundaries: { ...config.boundaries, wrap: checked },
                      })
                    }
                  />
                  <Label>Wrap at boundaries</Label>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                {/* Twinkle Effect */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.twinkle.enabled}
                      onCheckedChange={(checked) =>
                        onConfigChange({
                          twinkle: { ...config.twinkle, enabled: checked },
                        })
                      }
                    />
                    <Label>Twinkle Effect</Label>
                  </div>

                  {config.twinkle.enabled && (
                    <>
                      <Label>
                        Twinkle Speed: {config.twinkle.speed.toFixed(3)}
                      </Label>
                      <Slider
                        value={[config.twinkle.speed]}
                        onValueChange={([value]) =>
                          onConfigChange({
                            twinkle: { ...config.twinkle, speed: value },
                          })
                        }
                        min={0.001}
                        max={0.1}
                        step={0.001}
                      />

                      <Label>
                        Twinkle Intensity: {config.twinkle.intensity.toFixed(1)}
                      </Label>
                      <Slider
                        value={[config.twinkle.intensity]}
                        onValueChange={([value]) =>
                          onConfigChange({
                            twinkle: { ...config.twinkle, intensity: value },
                          })
                        }
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </>
                  )}
                </div>

                {/* Glow Effect */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.glow.enabled}
                      onCheckedChange={(checked) =>
                        onConfigChange({
                          glow: { ...config.glow, enabled: checked },
                        })
                      }
                    />
                    <Label>Glow Effect</Label>
                  </div>

                  {config.glow.enabled && (
                    <>
                      <Label>
                        Glow Intensity: {config.glow.intensity.toFixed(1)}
                      </Label>
                      <Slider
                        value={[config.glow.intensity]}
                        onValueChange={([value]) =>
                          onConfigChange({
                            glow: { ...config.glow, intensity: value },
                          })
                        }
                        min={0.1}
                        max={5}
                        step={0.1}
                      />

                      <Label>Glow Size: {config.glow.size.toFixed(1)}</Label>
                      <Slider
                        value={[config.glow.size]}
                        onValueChange={([value]) =>
                          onConfigChange({
                            glow: { ...config.glow, size: value },
                          })
                        }
                        min={0.5}
                        max={10}
                        step={0.1}
                      />
                    </>
                  )}
                </div>

                {/* Trail Effect */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.trails.enabled}
                      onCheckedChange={(checked) =>
                        onConfigChange({
                          trails: { ...config.trails, enabled: checked },
                        })
                      }
                    />
                    <Label>Trail Effect</Label>
                  </div>

                  {config.trails.enabled && (
                    <>
                      <Label>Trail Length: {config.trails.length}</Label>
                      <Slider
                        value={[config.trails.length]}
                        onValueChange={([value]) =>
                          onConfigChange({
                            trails: { ...config.trails, length: value },
                          })
                        }
                        min={5}
                        max={50}
                        step={1}
                      />

                      <Label>
                        Trail Opacity: {config.trails.opacity.toFixed(1)}
                      </Label>
                      <Slider
                        value={[config.trails.opacity]}
                        onValueChange={([value]) =>
                          onConfigChange({
                            trails: { ...config.trails, opacity: value },
                          })
                        }
                        min={0.1}
                        max={1}
                        step={0.1}
                      />
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
