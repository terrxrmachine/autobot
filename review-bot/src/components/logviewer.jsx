import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as Select from "./ui/select";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useLogs } from "../hooks/useLogs";

export const LogViewer = () => {
  const [filters, setFilters] = useState({
    level: "all",
    action: "",
    timeframe: "24h",
  });

  const { logs, isLoading, error, refresh, stats } = useLogs(filters);

  const getLevelIcon = (level) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Логи системы</span>
          <Button onClick={refresh} variant="outline">
            Обновить
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Фильтры */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div>
            <Select.Select
              value={filters.level}
              onValueChange={(value) =>
                setFilters({ ...filters, level: value })
              }
            >
              <Select.SelectTrigger>
                <Select.SelectValue placeholder="Уровень" />
              </Select.SelectTrigger>
              <Select.SelectContent>
                <Select.SelectItem value="all">Все уровни</Select.SelectItem>
                <Select.SelectItem value="error">Ошибки</Select.SelectItem>
                <Select.SelectItem value="warning">
                  Предупреждения
                </Select.SelectItem>
                <Select.SelectItem value="info">Информация</Select.SelectItem>
                <Select.SelectItem value="debug">Отладка</Select.SelectItem>
              </Select.SelectContent>
            </Select.Select>
          </div>
          <div>
            <Input
              placeholder="Фильтр по действию"
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
            />
          </div>
          <div>
            <Select.Select
              value={filters.timeframe}
              onValueChange={(value) =>
                setFilters({ ...filters, timeframe: value })
              }
            >
              <Select.SelectTrigger>
                <Select.SelectValue placeholder="Период" />
              </Select.SelectTrigger>
              <Select.SelectContent>
                <Select.SelectItem value="1h">1 час</Select.SelectItem>
                <Select.SelectItem value="24h">24 часа</Select.SelectItem>
                <Select.SelectItem value="7d">7 дней</Select.SelectItem>
                <Select.SelectItem value="30d">30 дней</Select.SelectItem>
              </Select.SelectContent>
            </Select.Select>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats?.totalErrors || 0}
              </div>
              <p className="text-sm text-muted-foreground">Ошибок за период</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats?.totalActions || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Действий за период
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats?.successRate || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Успешных действий</p>
            </CardContent>
          </Card>
        </div>

        {/* Таблица логов */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Уровень</TableHead>
              <TableHead className="w-[180px]">Время</TableHead>
              <TableHead>Действие</TableHead>
              <TableHead>Детали</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.timestamp}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getLevelIcon(log.level)}
                    <span className="capitalize">{log.level}</span>
                  </div>
                </TableCell>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
