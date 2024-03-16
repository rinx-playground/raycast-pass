(ns index
  (:require
    ["@raycast/api" :refer [ActionPanel Detail List Action]]
    ["os" :as os]
    ["path" :as path]
    ["fs/promises" :as fs]
    ["execa" :refer [execa]]
    ["react" :refer [useEffect useState]]))

(defn ^:async list-passes []
  (-> (path.join (os.homedir) ".password-store")
      (fs.readdir {:recursive true})
      (js-await)
      (->> (filter #(re-matches #".*\.gpg" %))
           (mapv #(subs % 0 (- (count %) 4))))))

(defn actions [path]
  #jsx [ActionPanel
        [Action
         {:title "Copy"
          :onAction (^:async fn []
                      (js-await (execa "/usr/local/bin/pass" ["-c" path])))}]
        [Action
         {:title "Copy OTP"
          :onAction (^:async fn []
                      (js-await (execa "/usr/local/bin/pass" ["otp" "-c" path])))}]])

(defn command []
  (let [[state set-state] (useState [])]
    (useEffect
      (fn []
        (let [f (^:async fn []
                 (-> (list-passes)
                     (js-await)
                     (set-state)))]
          (f))
        js/undefined)
      [])
    #jsx [List
          (map (fn [path]
                 #jsx [List.Item
                       {:icon "list-icon.png"
                        :key path
                        :title path
                        :actions (actions path)}])
               state)]))

(def default
  command)
