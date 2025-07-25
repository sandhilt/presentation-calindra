{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs?ref=nixos-25.05";
  };

  outputs =
    inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = (
          import (inputs.nixpkgs) {
            inherit system;
            config.allowUnfreePredicate = pkg: builtins.elem (pkgs.lib.getName pkg) [ "ngrok" ];
          }
        );
      in
      {
        formatter = pkgs.nixfmt-rfc-style;
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            ngrok
            qrcode
            ollama
          ];

          shellHook = ''
            echo "Welcome to the development shell!"
          '';
        };
      }
    );
}
