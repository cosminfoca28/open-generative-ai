# Read-only local hardware and developer-tool report for Windows.
# Does not install software, download models, access secrets, or send data anywhere.
$ErrorActionPreference = 'Continue'
Write-Output '=== AI Media Studio: Windows compatibility check ==='
$os = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
if ($os) {
    $ramGB = [math]::Round([double]$os.TotalVisibleMemorySize / 1MB, 1)
    Write-Output ("OS: {0}" -f $os.Caption)
    Write-Output ("Installed usable RAM (approx.): {0} GB" -f $ramGB)
} else { Write-Output 'OS/RAM: not available' }

$cpu = Get-CimInstance Win32_Processor -ErrorAction SilentlyContinue | Select-Object -First 1
if ($cpu) { Write-Output ("CPU: {0}" -f $cpu.Name) }

$gpus = @(Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue)
if ($gpus.Count -eq 0) { Write-Output 'GPU: not detected via WMI' }
foreach ($gpu in $gpus) {
    Write-Output ("GPU: {0}" -f $gpu.Name)
    if ($gpu.AdapterRAM -gt 0) {
        $reported = [math]::Round([double]$gpu.AdapterRAM / 1GB, 2)
        Write-Output ("GPU AdapterRAM (WMI, may be inaccurate): {0} GB" -f $reported)
    }
}
Write-Output 'Verify dedicated GPU memory in Windows Task Manager > Performance > GPU.'
$drive = Get-PSDrive -Name C -ErrorAction SilentlyContinue
if ($drive) { Write-Output ("C: available disk: {0} GB" -f ([math]::Round($drive.Free / 1GB, 1))) }
foreach ($name in @('git','node','npm')) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($cmd) {
        try {
            $version = & $name --version 2>$null | Select-Object -First 1
            Write-Output ("{0}: {1}" -f $name, $version)
        } catch {
            Write-Output ("{0}: present; version check failed" -f $name)
        }
    } else { Write-Output ("{0}: not installed or not on PATH" -f $name) }
}
Write-Output '=== End. No changes made. ==='
