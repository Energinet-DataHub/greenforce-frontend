param($filePath)

(Get-Content $filePath) | ForEach-Object {

    if ($_.Contains("string? api_version, ")) {

        $mod = $_.Replace("string? api_version, ", "")
        $mod.Replace(")", ", string? api_version = null)")

    } elseif ($_.Contains(", string? api_version)")) {

        $mod = $_.Replace(", string? api_version", "")
        $mod.Replace(")", ", string? api_version = null)")

    } elseif ($_.Contains("(string? api_version)")) {

        $_.Replace("string? api_version", "string? api_version = null")

    } elseif ($_ -match "(.*\(api_version,.*){1}" -and !$_.Contains("url")) {

        $mod = $_.Replace("api_version, ", "")
        $mod.Replace(")", ", api_version)")

    } elseif ($_ -match "(.*, api_version,.*){1}") {

        $mod = $_.Replace(", api_version", "")
        $mod.Replace(")", ", api_version)")

    } else {
        $_
    }
} | Set-Content "$filePath"
