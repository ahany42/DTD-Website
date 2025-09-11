import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit3, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ModelData {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
}

interface FeatureData {
  feature: string;
  importance: number;
}

interface EditableDataProps {
  performanceData: ModelData[];
  featureData: FeatureData[];
  onPerformanceUpdate: (data: ModelData[]) => void;
  onFeatureUpdate: (data: FeatureData[]) => void;
}

export const EditableData = ({ 
  performanceData, 
  featureData, 
  onPerformanceUpdate, 
  onFeatureUpdate 
}: EditableDataProps) => {
  const [isEditingModels, setIsEditingModels] = useState(false);
  const [isEditingFeatures, setIsEditingFeatures] = useState(false);
  const [editableModels, setEditableModels] = useState<ModelData[]>(performanceData);
  const [editableFeatures, setEditableFeatures] = useState<FeatureData[]>(featureData);
  const [newModelName, setNewModelName] = useState("");

  const handleSaveModels = () => {
    onPerformanceUpdate(editableModels);
    setIsEditingModels(false);
    toast.success("Model performance data updated!");
  };

  const handleSaveFeatures = () => {
    onFeatureUpdate(editableFeatures);
    setIsEditingFeatures(false);
    toast.success("Feature importance data updated!");
  };

  const handleCancelModels = () => {
    setEditableModels(performanceData);
    setIsEditingModels(false);
  };

  const handleCancelFeatures = () => {
    setEditableFeatures(featureData);
    setIsEditingFeatures(false);
  };

  const addNewModel = () => {
    if (!newModelName.trim()) {
      toast.error("Please enter a model name");
      return;
    }
    
    const newModel: ModelData = {
      model: newModelName,
      accuracy: 0.8,
      precision: 0.8,
      recall: 0.8,
    };
    
    setEditableModels([...editableModels, newModel]);
    setNewModelName("");
    toast.success("New model added!");
  };

  const removeModel = (index: number) => {
    setEditableModels(editableModels.filter((_, i) => i !== index));
    toast.success("Model removed!");
  };

  const addNewFeature = () => {
    const newFeature: FeatureData = {
      feature: `New Feature ${editableFeatures.length + 1}`,
      importance: 0.1,
    };
    
    setEditableFeatures([...editableFeatures, newFeature]);
    toast.success("New feature added!");
  };

  const removeFeature = (index: number) => {
    setEditableFeatures(editableFeatures.filter((_, i) => i !== index));
    toast.success("Feature removed!");
  };

  return (
    <div className="space-y-6">
      {/* Model Performance Editor */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Model Performance Data</span>
                {!isEditingModels && <Badge variant="outline">Editable</Badge>}
              </CardTitle>
              <CardDescription>
                Edit model accuracy, precision, and recall values
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {!isEditingModels ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingModels(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelModels}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveModels}
                    className="bg-primary-gradient"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingModels ? (
            <div className="space-y-6">
              {/* Add New Model */}
              <div className="border border-border rounded-lg p-4 bg-accent/20">
                <Label className="text-sm font-medium mb-2 block">Add New Model</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Model name (e.g., Linear Regression)"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addNewModel} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Edit Existing Models */}
              <div className="space-y-4">
                {editableModels.map((model, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        value={model.model}
                        onChange={(e) => {
                          const updated = [...editableModels];
                          updated[index].model = e.target.value;
                          setEditableModels(updated);
                        }}
                        className="max-w-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeModel(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Accuracy: {(model.accuracy * 100).toFixed(1)}%</Label>
                        <Slider
                          value={[model.accuracy * 100]}
                          onValueChange={(value) => {
                            const updated = [...editableModels];
                            updated[index].accuracy = value[0] / 100;
                            setEditableModels(updated);
                          }}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Precision: {(model.precision * 100).toFixed(1)}%</Label>
                        <Slider
                          value={[model.precision * 100]}
                          onValueChange={(value) => {
                            const updated = [...editableModels];
                            updated[index].precision = value[0] / 100;
                            setEditableModels(updated);
                          }}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Recall: {(model.recall * 100).toFixed(1)}%</Label>
                        <Slider
                          value={[model.recall * 100]}
                          onValueChange={(value) => {
                            const updated = [...editableModels];
                            updated[index].recall = value[0] / 100;
                            setEditableModels(updated);
                          }}
                          max={100}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {performanceData.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/20 transition-smooth">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h4 className="font-medium">{model.model}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="font-medium">{(model.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Precision</p>
                      <p className="font-medium">{(model.precision * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recall</p>
                      <p className="font-medium">{(model.recall * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Importance Editor */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Feature Importance Data</span>
                {!isEditingFeatures && <Badge variant="outline">Editable</Badge>}
              </CardTitle>
              <CardDescription>
                Adjust feature importance values and add new features
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {!isEditingFeatures ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingFeatures(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelFeatures}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveFeatures}
                    className="bg-primary-gradient"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingFeatures ? (
            <div className="space-y-6">
              {/* Add New Feature Button */}
              <Button onClick={addNewFeature} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Feature
              </Button>

              {/* Edit Features */}
              <div className="space-y-4">
                {editableFeatures.map((feature, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Input
                        value={feature.feature}
                        onChange={(e) => {
                          const updated = [...editableFeatures];
                          updated[index].feature = e.target.value;
                          setEditableFeatures(updated);
                        }}
                        className="max-w-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Importance: {(feature.importance * 100).toFixed(1)}%</Label>
                      <Slider
                        value={[feature.importance * 100]}
                        onValueChange={(value) => {
                          const updated = [...editableFeatures];
                          updated[index].importance = value[0] / 100;
                          setEditableFeatures(updated);
                        }}
                        max={100}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {featureData.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/20 transition-smooth">
                  <span className="font-medium">{feature.feature}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-accent rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-smooth" 
                        style={{ width: `${feature.importance * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {(feature.importance * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};