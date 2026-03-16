class OhMyAgent < Formula
  desc "Portable multi-agent harness for .agents-based skills and workflows"
  homepage "https://github.com/first-fluke/oh-my-agent"
  url "https://registry.npmjs.org/oh-my-agent/-/oh-my-agent-2.9.1.tgz"
  sha256 "214287b43f56514a2dfee53d813a4cfbc846813939a25d1f158228547eb79c05"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir[libexec/"bin/*"]
  end

  test do
    output = shell_output("#{bin}/oh-my-ag describe")
    assert_match "Multi-Agent Orchestrator", output

    assert_match version.to_s, shell_output("#{bin}/oh-my-ag version")
  end
end
