# Build script to package the extension into a .vsix file without external dependencies
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$vsixPath = Join-Path $root "monkeytype-vscode-0.1.0.vsix"
if (Test-Path $vsixPath) { Remove-Item $vsixPath -Force }

$tempDir = Join-Path $env:TEMP ("vsix_build_" + [Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

$extensionDir = Join-Path $tempDir "extension"
New-Item -ItemType Directory -Path $extensionDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $extensionDir "resources") | Out-Null

# Copy extension files into extension/
Copy-Item (Join-Path $root "package.json") (Join-Path $extensionDir "package.json")
Copy-Item (Join-Path $root "extension.js") (Join-Path $extensionDir "extension.js")
Copy-Item (Join-Path $root "README.md") (Join-Path $extensionDir "README.md")
Copy-Item (Join-Path $root "LICENSE") (Join-Path $extensionDir "LICENSE")
Copy-Item (Join-Path $root "resources\monkeytype.svg") (Join-Path $extensionDir "resources\monkeytype.svg")

# Write [Content_Types].xml
$contentTypes = @'
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="vsixmanifest" ContentType="text/xml"/>
  <Default Extension="json" ContentType="application/json"/>
  <Default Extension="js" ContentType="application/javascript"/>
  <Default Extension="svg" ContentType="image/svg+xml"/>
  <Default Extension="md" ContentType="text/markdown"/>
  <Default Extension="txt" ContentType="text/plain"/>
</Types>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "[Content_Types].xml"), $contentTypes, [System.Text.Encoding]::UTF8)

# Write extension.vsixmanifest
$vsixManifest = @'
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="monkeytype-vscode" Version="0.1.0" Publisher="antigravity"/>
    <DisplayName>Monkeytype</DisplayName>
    <Description xml:space="preserve">Quick access to Monkeytype inside Visual Studio Code's integrated browser.</Description>
    <Tags>monkeytype,typing,typing-test,wpm,speed-test</Tags>
    <Categories>Other,Productivity</Categories>
    <GalleryFlags>Public</GalleryFlags>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.85.0"/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value=""/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value=""/>
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace,web"/>
      <Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value=""/>
    </Properties>
    <License>extension/LICENSE</License>
    <Icon>extension/resources/monkeytype.svg</Icon>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE" Addressable="true"/>
    <Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/resources/monkeytype.svg" Addressable="true"/>
  </Assets>
</PackageManifest>
'@
[System.IO.File]::WriteAllText((Join-Path $tempDir "extension.vsixmanifest"), $vsixManifest, [System.Text.Encoding]::UTF8)

# Create ZipArchive (.vsix)
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $vsixPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)

# Clean up temporary build folder
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "VSIX package created successfully at: $vsixPath"
Get-Item $vsixPath | Select-Object Name, Length, LastWriteTime
