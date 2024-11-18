import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { openaiService } from "../services/openai/OpenAIService";

export const PromptTester = ({ promptTemplate, onUpdate }) => {
  const [testReview, setTestReview] = useState({
    rating: 5,
    text: "",
  });
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTest = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Тестируем промпт
      const response = await openaiService.testPrompt(
        promptTemplate,
        JSON.stringify(testReview)
      );

      // Проверяем качество ответа
      const isValid = await openaiService.validateResponse(
        testReview,
        response
      );

      if (!isValid) {
        // Если ответ не прошел валидацию, пробуем улучшить его
        const improvedResponse = await openaiService.improveResponse(
          testReview,
          response
        );
        setResult(improvedResponse);
      } else {
        setResult(response);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Тестирование промпта</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Тестовый отзыв</label>
          <div className="flex gap-4">
            <Input
              type="number"
              min="1"
              max="5"
              value={testReview.rating}
              onChange={(e) =>
                setTestReview((prev) => ({
                  ...prev,
                  rating: parseInt(e.target.value),
                }))
              }
              className="w-24"
            />
            <Textarea
              placeholder="Введите тестовый отзыв..."
              value={testReview.text}
              onChange={(e) =>
                setTestReview((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <Button
          onClick={handleTest}
          disabled={isLoading || !testReview.text}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Генерация ответа...
            </>
          ) : (
            "Протестировать"
          )}
        </Button>

        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>
        )}

        {result && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Результат:</label>
            <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
