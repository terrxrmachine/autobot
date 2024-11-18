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
import { PromptSettings } from "../components/promptsettings";
import { AccountSettings } from "../components/accountsettings";
import { useSettings } from "../hooks/useSettings";
import { AccountConnector } from "../components/accountconnector";

export const Settings = () => {
  const { platforms } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Настройки</h2>
      </div>

      <Tabs defaultValue="prompts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prompts">Промпты</TabsTrigger>
          <TabsTrigger value="accounts">Аккаунты</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle>Настройки промптов</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={platforms[0].id}>
                <TabsList>
                  {platforms.map((platform) => (
                    <TabsTrigger key={platform.id} value={platform.id}>
                      {platform.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {platforms.map((platform) => (
                  <TabsContent key={platform.id} value={platform.id}>
                    <PromptSettings platformId={platform.id} />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Настройки аккаунтов</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountSettings />
              <AccountConnector />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
