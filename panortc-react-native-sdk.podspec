require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "panortc-react-native-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/PanoVideo/panortc-react-native-sdk.git", :tag => "#{s.version}" }

  
  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.static_framework = true
  s.swift_version = "5.0"
  
  s.dependency "React-Core"
  s.dependency "PanoRtc_iOS", "1.4.4.6"
end
