param([string]$Masuk, [string]$Keluar)
# Mengubah teks (file UTF-8) menjadi WAV dengan suara Windows "Microsoft Andika" (bahasa Indonesia).
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Tunggu($op, [Type]$tipe) {
  $t = $asTask.MakeGenericMethod($tipe).Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result
}
$s = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$suara = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.Language -eq 'id-ID' } | Select-Object -First 1
if ($suara) { $s.Voice = $suara }
$s.Options.SpeakingRate = 0.95
$teks = [System.IO.File]::ReadAllText($Masuk, [System.Text.Encoding]::UTF8)
$aliran = Tunggu ($s.SynthesizeTextToStreamAsync($teks)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
$pembaca = New-Object Windows.Storage.Streams.DataReader($aliran.GetInputStreamAt(0))
$n = [uint32]$aliran.Size
$null = Tunggu ($pembaca.LoadAsync($n)) ([uint32])
$bita = New-Object byte[] $n
$pembaca.ReadBytes($bita)
[System.IO.File]::WriteAllBytes($Keluar, $bita)
Write-Output "ok $Keluar $n"
