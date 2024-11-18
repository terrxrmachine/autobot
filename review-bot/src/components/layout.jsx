import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Settings, Home } from "lucide-react";
import { Button } from "./ui/button";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Бот автоответов</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
};
