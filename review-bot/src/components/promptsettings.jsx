import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Star, Trash2, Play, Edit2, Check, X, Loader2 } from "lucide-react";
import { usePrompts } from "../hooks/usePrompts";
import { PromptTester } from "./prompttester";
import { Alert, AlertDescription } from "./ui/alert";

export const PromptSettings = ({ platformId }) => {
  const {
    prompts,
    newPrompt,
    setNewPrompt,
    testResult,
    error,
    isLoading,
    addPrompt,
    updatePrompt,
    deletePrompt,
    testPrompt,
  } = usePrompts(platformId);

  const [editingPrompt, setEditingPrompt] = useState(null);
  const [showTester, setShowTester] = useState(false);

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
  };

  const handleSaveEdit = () => {
    updatePrompt(editingPrompt.id, editingPrompt);
    setEditingPrompt(null);
  };

  const handleCancelEdit = () => {
    setEditingPrompt(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Количество звезд *
          </label>
          <Input
            type="number"
            min="1"
            max="5"
            value={newPrompt.stars}
            onChange={(e) =>
              setNewPrompt({ ...newPrompt, stars: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Ключевые слова
          </label>
          <Input
            placeholder="грязно, медленно, дорого..."
            value={newPrompt.keywords}
            onChange={(e) =>
              setNewPrompt({ ...newPrompt, keywords: e.target.value })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Шаблон ответа *
          </label>
          <Textarea
            placeholder="Используйте {name} для имени клиента, {rating} для оценки..."
            value={newPrompt.template}
            onChange={(e) =>
              setNewPrompt({ ...newPrompt, template: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={addPrompt} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            "Добавить промпт"
          )}
        </Button>
        <Button variant="outline" onClick={() => setShowTester(!showTester)}>
          {showTester ? "Скрыть тестер" : "Показать тестер"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showTester && (
        <PromptTester
          promptTemplate={newPrompt.template}
          onUpdate={(template) => setNewPrompt({ ...newPrompt, template })}
        />
      )}

      {testResult && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium">Результат тестирования:</h4>
          <div className="space-y-2">
            <div className="p-3 bg-background rounded">
              <p className="font-medium text-sm">Сгенерированный ответ:</p>
              <p className="mt-1">{testResult.original}</p>
            </div>
            {!testResult.isValid && testResult.improved && (
              <div className="p-3 bg-background rounded border-l-4 border-primary">
                <p className="font-medium text-sm">Улучшенная версия:</p>
                <p className="mt-1">{testResult.improved}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Звезды</TableHead>
            <TableHead>Ключевые слова</TableHead>
            <TableHead>Шаблон</TableHead>
            <TableHead className="w-[150px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id}>
              {editingPrompt?.id === prompt.id ? (
                // Режим редактирования
                <>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={editingPrompt.stars}
                      onChange={(e) =>
                        setEditingPrompt({
                          ...editingPrompt,
                          stars: e.target.value,
                        })
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editingPrompt.keywords}
                      onChange={(e) =>
                        setEditingPrompt({
                          ...editingPrompt,
                          keywords: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={editingPrompt.template}
                      onChange={(e) =>
                        setEditingPrompt({
                          ...editingPrompt,
                          template: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveEdit}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                // Режим просмотра
                <>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {prompt.stars}
                    </div>
                  </TableCell>
                  <TableCell>{prompt.keywords}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {prompt.template}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(prompt)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePrompt(prompt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
