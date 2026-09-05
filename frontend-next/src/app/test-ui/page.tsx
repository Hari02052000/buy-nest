'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Separator,
  Spinner,
  Alert,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui';

export default function TestUIPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UI Primitives Test</h1>
        <p className="text-muted-foreground">
          Foundation components for the Buy Nest admin application.
        </p>
      </div>

      <Separator />

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      {/* Inputs & Labels */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input & Label</h2>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="error-input">Error state</Label>
          <Input type="text" id="error-input" variant="error" value="Invalid input" readOnly />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="disabled-input">Disabled</Label>
          <Input type="text" id="disabled-input" placeholder="Disabled" disabled />
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badge</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </section>

      <Separator />

      {/* Alerts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert</h2>
        <div className="space-y-2">
          <Alert variant="default">Default alert message.</Alert>
          <Alert variant="destructive">Destructive alert message.</Alert>
          <Alert variant="success">Success alert message.</Alert>
          <Alert variant="warning">Warning alert message.</Alert>
        </div>
      </section>

      <Separator />

      {/* Spinner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spinner</h2>
        <div className="flex items-center gap-4">
          <Spinner size={16} />
          <Spinner size={24} />
          <Spinner size={32} />
        </div>
      </section>

      <Separator />

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card with border and shadow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Card content goes here.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Shadow only, no border.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Card content goes here.</p>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
              <CardDescription>Border only, transparent background.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Card content goes here.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Separator */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Separator</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Horizontal separator above:</p>
          <Separator />
          <p className="text-sm text-muted-foreground">Horizontal separator below.</p>
        </div>
        <div className="flex h-16 items-center gap-4">
          <span className="text-sm text-muted-foreground">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-muted-foreground">Right</span>
        </div>
      </section>

      <Separator />

      {/* Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a foundation dialog. It supports focus trap, Escape key,
                and scroll lock.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Dialog body content goes here.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
