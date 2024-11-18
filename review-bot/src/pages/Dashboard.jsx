import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Play, Pause } from "lucide-react";
import { ReviewList } from "../components/reviewlist";
import { useReviewBot } from "../hooks/useReviewBot";

export const Dashboard = () => {
  const {
    isRunning,
    toggleBot,
    platforms,
    currentPlatform,
    setCurrentPlatform,
    stats,
  } = useReviewBot();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
        <Button
          onClick={toggleBot}
          variant={isRunning ? "destructive" : "default"}
        >
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Остановить
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Запустить
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего отзывов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ответов за сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Среднее время ответа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageResponseTime}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="yandex" className="space-y-4">
        <TabsList>
          {platforms.map((platform) => (
            <TabsTrigger
              key={platform.id}
              value={platform.id}
              onClick={() => setCurrentPlatform(platform.id)}
            >
              {platform.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform.id} value={platform.id}>
            <Card>
              <CardHeader>
                <CardTitle>Последние отзывы - {platform.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewList platformId={platform.id} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
