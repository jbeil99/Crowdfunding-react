import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resendActivation } from "@/lib/auth";

export function ResendActivationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleResend = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resendActivation(email);
      toast({
        title: "Success",
        description:
          "Activation email has been resent. Please check your inbox.",
      });
      setShowInput(false);
      setEmail("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.detail || "Failed to resend activation email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showInput ? (
        <Button
          variant="outline"
          onClick={() => setShowInput(true)}
          className="w-full"
        >
          Resend Activation Email
        </Button>
      ) : (
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowInput(false);
                setEmail("");
              }}
              disabled={isLoading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
